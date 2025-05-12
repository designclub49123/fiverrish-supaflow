
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseFileUploadProps {
  bucketName: string;
  folderPath?: string;
  maxFileSize?: number; // In MB
  allowedFileTypes?: string[];
}

interface UploadResult {
  publicUrl: string;
  filePath: string;
}

export function useFileUpload({
  bucketName,
  folderPath = '',
  maxFileSize = 5, // Default 5MB
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'],
}: UseFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum file size is ${maxFileSize}MB`
      });
      return false;
    }
    
    // Check file type
    if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
      setError(`File type ${file.type} not allowed`);
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `Supported formats: ${allowedFileTypes.map(type => type.split('/')[1]).join(', ')}`
      });
      return false;
    }
    
    return true;
  };
  
  const uploadFile = async (file: File, customPath?: string): Promise<UploadResult | null> => {
    try {
      if (!validateFile(file)) {
        return null;
      }
      
      setIsUploading(true);
      setError(null);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to upload files');
      }
      
      // Generate a unique file name to avoid overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      let filePath = fileName;
      
      // If folder path is provided, prepend it to the file path
      if (customPath) {
        filePath = `${customPath}/${fileName}`;
      } else if (folderPath) {
        filePath = `${folderPath}/${fileName}`;
      }
      
      // Add user_id to path for better organization if folder doesn't already include it
      if (!customPath && !filePath.includes(session.user.id)) {
        filePath = `${session.user.id}/${filePath}`;
      }
      
      // Upload file to storage bucket
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      return { publicUrl, filePath };
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err.message || 'Error uploading file');
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err.message || 'Failed to upload file. Please try again.'
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const uploadMultipleFiles = async (
    files: File[], 
    customPath?: string
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file, customPath);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  };
  
  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    error,
  };
}
