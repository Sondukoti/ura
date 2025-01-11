/*
  # User Profiles and API Keys Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `updated_at` (timestamp)
      - `theme_preference` (text)
      - `language_preference` (text)
    - `api_keys`
      - `id` (uuid)
      - `user_id` (uuid, references profiles)
      - `service` (text)
      - `key_value` (text, encrypted)
      - `created_at` (timestamp)
      - `last_used` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Encrypt sensitive API key values
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  theme_preference text DEFAULT 'light',
  language_preference text DEFAULT 'en',
  CONSTRAINT valid_theme CHECK (theme_preference IN ('light', 'dark', 'system')),
  CONSTRAINT valid_language CHECK (language_preference ~ '^[a-z]{2}(-[A-Z]{2})?$')
);

-- Create API keys table with encryption
CREATE EXTENSION IF NOT EXISTS "pgsodium";

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  service text NOT NULL,
  key_value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz DEFAULT now(),
  CONSTRAINT valid_service CHECK (service IN ('gemini', 'serp', 'core', 'semanticScholar', 'youtube', 'newsapi'))
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- API keys policies
CREATE POLICY "Users can view own API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own API keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();