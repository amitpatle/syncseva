/*
  # Person Directory Database Schema

  1. New Tables
    - `persons`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key) - Links to auth.users
      - `name` (text) - Person's full name
      - `photo_url` (text, optional) - URL to uploaded photo
      - `emergency_contact_name` (text) - Emergency contact name
      - `emergency_contact_phone` (text) - Emergency contact phone
      - `address_street` (text) - Street address
      - `address_city` (text) - City
      - `address_state` (text) - State/Province
      - `address_postal_code` (text) - Postal/ZIP code
      - `address_country` (text) - Country
      - `public_share_id` (text, unique) - Unique ID for public sharing
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `persons` table
    - Add policies for authenticated users to manage their own data
    - Add policy for public read access via share_id

  3. Indexes
    - Index on user_id for fast user queries
    - Index on public_share_id for fast public lookups
*/

-- Create the persons table
CREATE TABLE IF NOT EXISTS persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  photo_url text,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  address_street text NOT NULL,
  address_city text NOT NULL,
  address_state text NOT NULL,
  address_postal_code text NOT NULL,
  address_country text NOT NULL DEFAULT 'United States',
  public_share_id text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users to manage their own data
CREATE POLICY "Users can view their own persons"
  ON persons
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own persons"
  ON persons
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own persons"
  ON persons
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own persons"
  ON persons
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for public read access via share_id
CREATE POLICY "Anyone can view persons via public share link"
  ON persons
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS persons_user_id_idx ON persons(user_id);
CREATE INDEX IF NOT EXISTS persons_public_share_id_idx ON persons(public_share_id);
CREATE INDEX IF NOT EXISTS persons_created_at_idx ON persons(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_persons_updated_at 
  BEFORE UPDATE ON persons 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();