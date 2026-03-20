
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- buyer_profiles
DROP POLICY IF EXISTS "Users can insert their own buyer profile" ON public.buyer_profiles;
DROP POLICY IF EXISTS "Users can update their own buyer profile" ON public.buyer_profiles;
DROP POLICY IF EXISTS "Users can view their own buyer profile" ON public.buyer_profiles;

CREATE POLICY "Users can insert their own buyer profile"
ON public.buyer_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyer profile"
ON public.buyer_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own buyer profile"
ON public.buyer_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- seller_profiles
DROP POLICY IF EXISTS "Users can insert their own seller profile" ON public.seller_profiles;
DROP POLICY IF EXISTS "Users can update their own seller profile" ON public.seller_profiles;
DROP POLICY IF EXISTS "Users can view their own seller profile" ON public.seller_profiles;

CREATE POLICY "Users can insert their own seller profile"
ON public.seller_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seller profile"
ON public.seller_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own seller profile"
ON public.seller_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- user_roles
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can insert their own role"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);
