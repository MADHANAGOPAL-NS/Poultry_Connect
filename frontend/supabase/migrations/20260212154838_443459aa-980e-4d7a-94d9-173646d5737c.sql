
-- Drop all RESTRICTIVE policies on buyer_profiles and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can insert their own buyer profile" ON public.buyer_profiles;
DROP POLICY IF EXISTS "Users can update their own buyer profile" ON public.buyer_profiles;
DROP POLICY IF EXISTS "Users can view their own buyer profile" ON public.buyer_profiles;

CREATE POLICY "Users can view their own buyer profile" ON public.buyer_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own buyer profile" ON public.buyer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own buyer profile" ON public.buyer_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Drop all RESTRICTIVE policies on seller_profiles and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can insert their own seller profile" ON public.seller_profiles;
DROP POLICY IF EXISTS "Users can update their own seller profile" ON public.seller_profiles;
DROP POLICY IF EXISTS "Users can view their own seller profile" ON public.seller_profiles;

CREATE POLICY "Users can view their own seller profile" ON public.seller_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own seller profile" ON public.seller_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own seller profile" ON public.seller_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Drop all RESTRICTIVE policies on user_roles and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix subscription_details policies too
DROP POLICY IF EXISTS "Service can insert subscriptions" ON public.subscription_details;
DROP POLICY IF EXISTS "Service can update subscriptions" ON public.subscription_details;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscription_details;

CREATE POLICY "Users can view their own subscriptions" ON public.subscription_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert subscriptions" ON public.subscription_details FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update subscriptions" ON public.subscription_details FOR UPDATE USING (true);
