/*
  # Fix Public Sharing Access

  1. Security Policy Updates
    - Remove overly broad public access policy
    - Add specific policy for public share access
    - Ensure anonymous users can access shared persons

  2. Changes
    - Drop existing public policy that may be causing conflicts
    - Create new policy specifically for public_share_id access
    - Allow both anonymous and authenticated users to access via share ID
*/

-- Drop the existing broad public policy
DROP POLICY IF EXISTS "Anyone can view persons via public share link" ON persons;
DROP POLICY IF EXISTS "Public access via share_id only" ON persons;

-- Create a specific policy for public sharing
CREATE POLICY "Public access via share_id"
  ON persons
  FOR SELECT
  TO anon, authenticated
  USING (public_share_id IS NOT NULL);