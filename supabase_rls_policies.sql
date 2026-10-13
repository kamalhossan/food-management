-- =========================================================================
-- SUPABASE RLS FIX FOR 'workers' TABLE
-- =========================================================================
-- You are seeing this issue because RLS was enabled in the table settings,
-- which tells PostgreSQL to hide all existing items (SELECT returns empty)
-- and block all new items (INSERT violates policy).
--
-- Choose OPTION 1 (Easiest) or OPTION 2 (Keep RLS active):
-- =========================================================================

-- -------------------------------------------------------------------------
-- OPTION 1: DISABLE RLS (Recommended if you don't have user authentication)
-- -------------------------------------------------------------------------
-- If you just want everything to work immediately without managing policies:
-- Run this in Supabase Dashboard -> SQL Editor:

ALTER TABLE public.workers DISABLE ROW LEVEL SECURITY;


-- -------------------------------------------------------------------------
-- OPTION 2: KEEP RLS ENABLED (Allow public / anon access)
-- -------------------------------------------------------------------------
-- If you want RLS enabled, run this script in Supabase Dashboard -> SQL Editor:

-- 1. Grant table & sequence access to anon and authenticated roles
GRANT ALL ON TABLE public.workers TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 2. Drop any existing policies that might be blocking access
DROP POLICY IF EXISTS "workers_anon_all" ON public.workers;
DROP POLICY IF EXISTS "allow_anon_select" ON public.workers;
DROP POLICY IF EXISTS "allow_anon_insert" ON public.workers;
DROP POLICY IF EXISTS "allow_anon_update" ON public.workers;
DROP POLICY IF EXISTS "allow_anon_delete" ON public.workers;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.workers;

-- 3. Enable RLS
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

-- 4. Create one single policy granting full access to anon and authenticated
CREATE POLICY "workers_anon_all"
ON public.workers
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
