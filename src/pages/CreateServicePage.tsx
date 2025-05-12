import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFileUpload } from '@/hooks/useFileUpload';

export default function CreateServicePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [revisions, setRevisions] = useState('3');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { uploadMultipleFiles, isUploading } = useFileUpload({
    bucketName: 'service-images',
    maxFileSize: 5,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif']
  });

  useEffect(() => {
    // Fetch categories from database
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');
          
        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      
      // Validate file size (limit to 5MB)
      const validFiles = fileList.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (validFiles.length !== fileList.length) {
        toast({
          variant: "destructive",
          title: "File Size Error",
          description: "Some files exceed the maximum size of 5MB and were not added.",
        });
      }
      
      // Make sure we don't exceed 5 images in total
      const newFiles = validFiles.slice(0, 5 - images.length);
      
      if (images.length + newFiles.length >= 5) {
        toast({
          title: "Maximum Images",
          description: "You can upload a maximum of 5 images per service.",
        });
      }
      
      setImages(prev => [...prev, ...newFiles].slice(0, 5));
      
      // Create preview URLs
      const urls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...urls].slice(0, 5));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!title || title.length < 5) {
      setError("Service title must be at least 5 characters");
      return false;
    }
    
    if (!description || description.length < 50) {
      setError("Description must be at least 50 characters");
      return false;
    }
    
    if (!category) {
      setError("Please select a category");
      return false;
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    
    if (!deliveryTime || isNaN(parseInt(deliveryTime)) || parseInt(deliveryTime) <= 0) {
      setError("Please enter a valid delivery time");
      return false;
    }
    
    if (images.length === 0) {
      setError("Please upload at least one image");
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to create a service.",
        });
        navigate('/auth');
        return;
      }
      
      // Upload images to storage
      const uploadedImages = await uploadMultipleFiles(images, `services/${session.user.id}`);
      
      if (uploadedImages.length === 0) {
        throw new Error('Failed to upload service images');
      }
      
      const uploadedImageUrls = uploadedImages.map(img => img.publicUrl);
      
      // Insert service into database
      const { data, error } = await supabase
        .from('services')
        .insert([
          {
            title,
            description,
            category_id: category,
            price: parseFloat(price),
            delivery_time: parseInt(deliveryTime),
            revisions: parseInt(revisions),
            images: uploadedImageUrls,
            freelancer_id: session.user.id,
            created_at: new Date().toISOString(),
          }
        ])
        .select();
      
      if (error) throw new Error(`Database error: ${error.message}`);
      
      toast({
        title: "Service Created",
        description: "Your service has been successfully created.",
      });
      
      // Navigate to services page
      navigate('/dashboard/services');
      
    } catch (error: any) {
      console.error('Error creating service:', error);
      setError(error.message || "Failed to create service. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create service. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Create a New Service</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Provide detailed information about the service you want to offer
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  placeholder="I will design a professional logo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading || isUploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Clearly describe what you are offering (min. 5 characters)
                </p>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[150px]"
                  disabled={loading || isUploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a detailed description of your service (min. 50 characters)
                </p>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} disabled={loading || isUploading}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="graphic-design">Graphic Design</SelectItem>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                        <SelectItem value="writing">Content Writing</SelectItem>
                        <SelectItem value="video-animation">Video & Animation</SelectItem>
                        <SelectItem value="music-audio">Music & Audio</SelectItem>
                        <SelectItem value="programming">Programming & Tech</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="29.99"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    disabled={loading || isUploading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="deliveryTime">Delivery Time (days)</Label>
                  <Input
                    id="deliveryTime"
                    type="number"
                    placeholder="3"
                    min="1"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    required
                    disabled={loading || isUploading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="revisions">Revisions</Label>
                  <Input
                    id="revisions"
                    type="number"
                    placeholder="3"
                    min="0"
                    value={revisions}
                    onChange={(e) => setRevisions(e.target.value)}
                    required
                    disabled={loading || isUploading}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="images">Service Images (Up to 5)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading || isUploading || images.length >= 5}
                  />
                  <Label htmlFor="images" className={`cursor-pointer block ${(loading || isUploading || images.length >= 5) ? 'opacity-50' : ''}`}>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF up to 5MB each (max 5 images)
                    </p>
                  </Label>
                </div>
                
                {imageUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={loading || isUploading}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Button type="submit" disabled={loading || isUploading} className="w-full">
              {loading || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? 'Uploading Images...' : 'Creating...'}
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
