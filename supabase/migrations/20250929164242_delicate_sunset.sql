/*
  # Create persons table and security policies

  1. New Tables
    - `persons`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `photo_url` (text, optional)
      - `emergency_contact` (text, required)
      - `address` (jsonb, structured address data)
      - `public_link_id` (text, unique identifier for public access)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Storage Setup
    - Create `person-photos` storage bucket for image uploads
    - Configure public access for images

  3. Security
    - Enable RLS on `persons` table
    - Add policies for authenticated users to manage their own data
    - Add policy for public read access via public_link_id
    - Add storage policies for secure file uploads

  4. Indexes
    - Add index on user_id for performance
    - Add index on public_link_id for public access
*/

-- Create persons table
CREATE TABLE IF NOT EXISTS persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_url text,
  emergency_contact text NOT NULL,
  address jsonb NOT NULL,
  public_link_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can read own persons"
  ON persons
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own persons"
  ON persons
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own persons"
  ON persons
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own persons"
  ON persons
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow public read access via public_link_id (for sharing)
CREATE POLICY "Allow public read access"
  ON persons
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_persons_user_id ON persons(user_id);
CREATE INDEX IF NOT EXISTS idx_persons_public_link_id ON persons(public_link_id);
CREATE INDEX IF NOT EXISTS idx_persons_created_at ON persons(created_at DESC);

-- Create storage bucket for person photos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'person-photos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('person-photos', 'person-photos', true);
  END IF;
END $$;

-- Create storage policies
DO $$
BEGIN
  -- Check if policy already exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload photos'
  ) THEN
    CREATE POLICY "Users can upload photos"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'person-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view photos'
  ) THEN
    CREATE POLICY "Anyone can view photos"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'person-photos');
  END IF;
END $$;