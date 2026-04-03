-- Update the function to use the new admin email
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user's email is the specific admin email
  IF NEW.email = 'varaver90@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure it works for the new admin user if they already exist
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'varaver90@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Optional: If we want to remove the old admin email from being automatically assigned
-- (already handled by CREATE OR REPLACE FUNCTION)
