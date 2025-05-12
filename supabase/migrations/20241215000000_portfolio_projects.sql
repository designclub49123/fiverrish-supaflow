
-- Create portfolio_projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_url TEXT,
  completion_date DATE,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up RLS for portfolio_projects table
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view portfolio projects
CREATE POLICY "Portfolio projects are viewable by everyone" 
ON public.portfolio_projects FOR SELECT 
USING (true);

-- Users can only create their own portfolio projects
CREATE POLICY "Users can create their own portfolio projects" 
ON public.portfolio_projects FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

-- Users can only update their own portfolio projects
CREATE POLICY "Users can update their own portfolio projects" 
ON public.portfolio_projects FOR UPDATE 
USING (auth.uid() = profile_id);

-- Users can only delete their own portfolio projects
CREATE POLICY "Users can delete their own portfolio projects" 
ON public.portfolio_projects FOR DELETE 
USING (auth.uid() = profile_id);

-- Set up updated_at trigger
CREATE TRIGGER update_portfolio_projects_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
