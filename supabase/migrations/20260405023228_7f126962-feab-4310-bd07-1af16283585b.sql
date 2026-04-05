-- Remove admin role from all users EXCEPT varaver90@gmail.com
DELETE FROM public.user_roles 
WHERE role = 'admin' 
AND user_id NOT IN (
  SELECT id FROM auth.users WHERE email = 'varaver90@gmail.com'
);

-- Ensure varaver90@gmail.com has the admin role (it already has it based on my check, but let's be safe)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'varaver90@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE role = 'admin' AND user_id = (SELECT id FROM auth.users WHERE email = 'varaver90@gmail.com')
);
