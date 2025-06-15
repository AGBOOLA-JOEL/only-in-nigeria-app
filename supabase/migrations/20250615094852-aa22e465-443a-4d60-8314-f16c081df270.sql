
-- Create a table to store posts
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  content text NOT NULL,
  votes integer NOT NULL DEFAULT 1
);

-- Create a table to store comments
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  content text NOT NULL,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE
);

-- Enable Row Level Security for posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all posts
CREATE POLICY "Allow public read access to posts"
  ON public.posts
  FOR SELECT
  USING (true);

-- Allow anyone to create new posts
CREATE POLICY "Allow public insert access to posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update posts (for voting)
CREATE POLICY "Allow public update access to posts"
  ON public.posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Enable Row Level Security for comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all comments
CREATE POLICY "Allow public read access to comments"
  ON public.comments
  FOR SELECT
  USING (true);

-- Allow anyone to create new comments
CREATE POLICY "Allow public insert access to comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (true);

-- Create a function to safely update vote counts
CREATE OR REPLACE FUNCTION public.update_post_vote(post_id_to_update uuid, vote_value integer)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.posts
  SET votes = votes + vote_value
  WHERE id = post_id_to_update;
END;
$$;
