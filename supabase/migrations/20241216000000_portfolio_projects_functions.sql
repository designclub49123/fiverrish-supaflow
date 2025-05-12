
-- Function to get portfolio projects for a user
CREATE OR REPLACE FUNCTION public.get_user_portfolio_projects(user_id UUID)
RETURNS SETOF public.portfolio_projects
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.portfolio_projects 
  WHERE profile_id = user_id
  ORDER BY created_at DESC;
$$;

-- Function to insert a portfolio project
CREATE OR REPLACE FUNCTION public.insert_portfolio_project(
  p_title TEXT,
  p_description TEXT,
  p_project_url TEXT,
  p_completion_date DATE,
  p_images TEXT[],
  p_profile_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  project_id UUID;
BEGIN
  INSERT INTO public.portfolio_projects (
    title,
    description,
    project_url,
    completion_date,
    images,
    profile_id
  ) VALUES (
    p_title,
    p_description,
    p_project_url,
    p_completion_date,
    p_images,
    p_profile_id
  )
  RETURNING id INTO project_id;
  
  RETURN project_id;
END;
$$;

-- Function to delete a portfolio project
CREATE OR REPLACE FUNCTION public.delete_portfolio_project(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.portfolio_projects
  WHERE id = p_project_id
  AND profile_id = auth.uid();
  
  RETURN FOUND;
END;
$$;
