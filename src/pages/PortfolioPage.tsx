
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url?: string;
  created_at: string;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchPortfolio();
  }, []);

  const checkAuthAndFetchPortfolio = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if user is freelancer
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_freelancer')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setIsFreelancer(profile.is_freelancer);
        if (profile.is_freelancer) {
          await fetchPortfolioProjects(session.user.id);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load portfolio. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioProjects = async (userId: string) => {
    try {
      // For now, we'll create a mock portfolio since the portfolio_projects table doesn't exist
      // In a real implementation, you would fetch from a portfolio_projects table
      const mockProjects: PortfolioProject[] = [
        {
          id: '1',
          title: 'E-commerce Website Design',
          description: 'Modern responsive e-commerce website with clean UI/UX design',
          image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&auto=format&fit=crop&q=60',
          project_url: 'https://example.com',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Mobile App UI Design',
          description: 'iOS and Android app interface design with modern aesthetics',
          image_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop&q=60',
          project_url: 'https://example.com',
          created_at: new Date().toISOString()
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        // Update existing project
        const updatedProjects = projects.map(project =>
          project.id === editingProject.id
            ? { ...project, ...formData }
            : project
        );
        setProjects(updatedProjects);
        toast({
          title: "Project updated",
          description: "Your portfolio project has been updated successfully.",
        });
      } else {
        // Add new project
        const newProject: PortfolioProject = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString()
        };
        setProjects([newProject, ...projects]);
        toast({
          title: "Project added",
          description: "Your portfolio project has been added successfully.",
        });
      }
      
      setIsDialogOpen(false);
      setEditingProject(null);
      setFormData({ title: '', description: '', image_url: '', project_url: '' });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save project. Please try again.",
      });
    }
  };

  const handleEdit = (project: PortfolioProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      project_url: project.project_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (projectId: string) => {
    try {
      setProjects(projects.filter(project => project.id !== projectId));
      toast({
        title: "Project deleted",
        description: "Your portfolio project has been deleted successfully.",
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isFreelancer) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Portfolio is only available for freelancers. Switch to a freelancer account to manage your portfolio.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProject(null);
              setFormData({ title: '', description: '', image_url: '', project_url: '' });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject 
                    ? 'Update your portfolio project details.' 
                    : 'Add a new project to showcase your work.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <label className="text-sm font-medium">Project Title</label>
                  <Input
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe your project"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Project URL (Optional)</label>
                  <Input
                    placeholder="https://project-website.com"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {editingProject ? 'Update Project' : 'Add Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium mb-2">No portfolio projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your portfolio by adding your first project
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {project.project_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(project.project_url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
