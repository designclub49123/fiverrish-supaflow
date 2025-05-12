
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Trash2, Clock, Link2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Project {
  id: string;
  title: string;
  description: string;
  project_url: string | null;
  completion_date: string | null;
  images: string[] | null;
  profile_id: string;
  created_at: string;
}

export default function PortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    project_url: '',
    completion_date: ''
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      // Use raw query instead of rpc to avoid typing issues
      const { data, error } = await supabase.functions.invoke<Project[]>('get-portfolio-projects', {
        body: { user_id: session.user.id }
      });
      
      if (error) throw error;
      
      setProjects(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        variant: "destructive",
        title: "Error fetching projects",
        description: "Failed to load your portfolio projects."
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      
      // Make sure we don't exceed 3 images in total
      const newFiles = validFiles.slice(0, 3 - imageFiles.length);
      
      if (imageFiles.length + newFiles.length >= 3) {
        toast({
          title: "Maximum Images",
          description: "You can upload a maximum of 3 images per project.",
        });
      }
      
      setImageFiles(prev => [...prev, ...newFiles].slice(0, 3));
      
      // Create preview URLs
      const urls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...urls].slice(0, 3));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setProjectForm({
      title: '',
      description: '',
      project_url: '',
      completion_date: ''
    });
    setImageFiles([]);
    // Revoke all object URLs
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    setImageUrls([]);
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectForm.title || !projectForm.description) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Title and description are required"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to add projects.",
        });
        return;
      }
      
      // Upload images to storage
      const uploadedImageUrls: string[] = [];
      
      for (const image of imageFiles) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(`public/${session.user.id}/${fileName}`, image);
        
        if (uploadError) {
          throw new Error(`Upload error: ${uploadError.message}`);
        }
        
        // Get public URL for the uploaded image
        const { data: publicUrl } = supabase.storage
          .from('project-images')
          .getPublicUrl(`public/${session.user.id}/${fileName}`);
        
        uploadedImageUrls.push(publicUrl.publicUrl);
      }
      
      // Use raw query instead of rpc to avoid typing issues
      const { data, error } = await supabase.functions.invoke<{id: string}>('insert-portfolio-project', {
        body: {
          title: projectForm.title,
          description: projectForm.description,
          project_url: projectForm.project_url || null,
          completion_date: projectForm.completion_date || null,
          images: uploadedImageUrls,
          profile_id: session.user.id
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Project Added",
        description: "Your portfolio project has been added successfully",
      });
      
      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add project. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      // Use raw query instead of rpc to avoid typing issues
      const { error } = await supabase.functions.invoke('delete-portfolio-project', {
        body: { project_id: projectId }
      });
      
      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== projectId));
      
      toast({
        title: "Project Deleted",
        description: "Your portfolio project has been deleted",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Portfolio Projects</CardTitle>
          <CardDescription>
            Showcase your previous work to potential clients
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Portfolio Project</DialogTitle>
              <DialogDescription>
                Add details about a project you've completed to showcase your skills.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  value={projectForm.title}
                  onChange={handleInputChange}
                  placeholder="E.g., Company Rebrand for XYZ Corp"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={projectForm.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you did, challenges you overcame, and results achieved"
                  required
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_url">Project URL (Optional)</Label>
                  <Input 
                    id="project_url" 
                    name="project_url"
                    value={projectForm.project_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="completion_date">Completion Date (Optional)</Label>
                  <Input 
                    id="completion_date" 
                    name="completion_date"
                    type="date"
                    value={projectForm.completion_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Project Images (Max 3)</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                  <Input
                    id="project_images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="project_images" className="cursor-pointer block">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Click to upload project images
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF up to 5MB each
                    </p>
                  </Label>
                </div>
                
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <Card key={item} className="w-full h-48 animate-pulse">
                <div className="bg-muted h-full rounded-lg"></div>
              </Card>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  {project.images && project.images.length > 0 ? (
                    <img 
                      src={project.images[0]} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No image</p>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {project.description}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {project.completion_date && (
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(project.completion_date).toLocaleDateString()}
                      </div>
                    )}
                    
                    {project.project_url && (
                      <a 
                        href={project.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        <Link2 className="h-3 w-3 mr-1" />
                        View Project
                      </a>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No portfolio projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your previous work to showcase your skills to potential clients
            </p>
            <DialogTrigger asChild>
              <Button>
                Add Your First Project
              </Button>
            </DialogTrigger>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
