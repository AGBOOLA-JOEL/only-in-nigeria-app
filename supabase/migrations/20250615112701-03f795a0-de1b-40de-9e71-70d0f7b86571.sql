
-- Add a "name" field to the posts table.
ALTER TABLE public.posts ADD COLUMN name text;

-- Existing posts will have name as NULL. New posts should fill it in.

-- (No RLS policy changes needed since table is public for all actions.)

