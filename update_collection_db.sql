-- SQL UPDATE FOR COLLECTIONS
-- Run this in the Supabase SQL Editor

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS collection JSONB DEFAULT '[]'::jsonb;

-- Ensure RLS is updated if needed (usually not needed if already using authenticated access)
-- GRANT ALL ON TABLE public.profiles TO authenticated;
