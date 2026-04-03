-- Update default status for bug_reports
ALTER TABLE public.bug_reports ALTER COLUMN status SET DEFAULT 'new';

-- Update existing records if any (just in case, although they were empty)
UPDATE public.bug_reports SET status = 'new' WHERE status = 'pending';
