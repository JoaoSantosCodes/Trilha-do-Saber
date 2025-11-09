-- Forçar reload do schema cache do PostgREST
-- Execute este comando no SQL Editor do Supabase

NOTIFY pgrst, 'reload schema';

