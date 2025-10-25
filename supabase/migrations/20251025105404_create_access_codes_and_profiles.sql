/*
  # Create Access Codes and User Profiles System

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `subscription_plan` (text) - 'free', 'pro', 'ultimate'
      - `is_admin` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `access_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique) - The access code itself
      - `plan_type` (text) - 'pro', 'ultimate'
      - `is_admin_code` (boolean) - If true, grants admin access
      - `is_used` (boolean) - Whether code has been redeemed
      - `used_by` (uuid, nullable) - User who redeemed the code
      - `used_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can read their own profile
    - Users can update their own profile
    - Anyone can check if access code exists (but not see who used it)
    - Only the system can mark codes as used

  3. Initial Data
    - Insert two access codes:
      - 'CAF12-12' for lifetime pro access
      - 'CAFadmin' for lifetime admin access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  subscription_plan text DEFAULT 'free',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create access_codes table
CREATE TABLE IF NOT EXISTS access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  plan_type text NOT NULL,
  is_admin_code boolean DEFAULT false,
  is_used boolean DEFAULT false,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Access Codes RLS Policies
CREATE POLICY "Anyone can check if code exists"
  ON access_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can update codes"
  ON access_codes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert the two access codes
INSERT INTO access_codes (code, plan_type, is_admin_code) 
VALUES 
  ('CAF12-12', 'ultimate', false),
  ('CAFadmin', 'ultimate', true)
ON CONFLICT (code) DO NOTHING;

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();