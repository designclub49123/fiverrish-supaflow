
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.41.0'

interface RequestBody {
  title: string;
  description: string;
  project_url: string | null;
  completion_date: string | null;
  images: string[];
  profile_id: string;
}

serve(async (req) => {
  // Create a Supabase client with the Auth context of the logged in user
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  )

  // Get the request body
  const {
    title,
    description,
    project_url,
    completion_date,
    images,
    profile_id
  }: RequestBody = await req.json()

  try {
    // Use SQL query to call the function
    const { data, error } = await supabaseClient.rpc(
      'insert_portfolio_project',
      {
        p_title: title,
        p_description: description,
        p_project_url: project_url,
        p_completion_date: completion_date,
        p_images: images,
        p_profile_id: profile_id
      }
    )

    if (error) throw error

    return new Response(JSON.stringify({ id: data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
