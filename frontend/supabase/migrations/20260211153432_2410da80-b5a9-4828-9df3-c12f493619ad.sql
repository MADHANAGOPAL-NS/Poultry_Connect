
-- Subscription details table
CREATE TABLE public.subscription_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL DEFAULT 'monthly',
  status text NOT NULL DEFAULT 'active',
  amount_paid numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  payment_method text,
  payment_gateway text,
  transaction_id text,
  receipt_url text,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON public.subscription_details FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert subscriptions"
  ON public.subscription_details FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can update subscriptions"
  ON public.subscription_details FOR UPDATE
  USING (true);

-- Buyer profiles table
CREATE TABLE public.buyer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text,
  location text,
  business_name text,
  preferred_products text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own buyer profile"
  ON public.buyer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buyer profile"
  ON public.buyer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyer profile"
  ON public.buyer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Seller profiles table
CREATE TABLE public.seller_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text,
  farm_name text,
  farm_location text,
  farm_size text,
  poultry_types text,
  experience_years integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own seller profile"
  ON public.seller_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own seller profile"
  ON public.seller_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seller profile"
  ON public.seller_profiles FOR UPDATE
  USING (auth.uid() = user_id);
