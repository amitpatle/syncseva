/*
  # Add medical information to persons table

  1. Changes
    - Add `medical_info` jsonb column to persons table to store comprehensive medical details
    - Update existing persons to have empty medical_info object
    - Add index for better query performance

  2. Medical Information Structure
    - blood_type: Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
    - allergies: Array of allergy strings
    - medical_conditions: Array of medical condition strings
    - medications: Array of medication objects with name, dosage, frequency, prescribing_doctor, notes
    - emergency_medical_info: Critical medical information for emergencies
    - healthcare_provider: Object with name, phone, address, specialty
    - insurance_info: Object with provider, policy_number, group_number, contact_phone
    - medical_notes: Additional medical notes
    - date_of_birth: Date of birth
    - height: Height information
    - weight: Weight information
    - organ_donor: Boolean for organ donor status
*/

-- Add medical_info column to persons table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'persons' AND column_name = 'medical_info'
  ) THEN
    ALTER TABLE persons ADD COLUMN medical_info jsonb DEFAULT '{}';
  END IF;
END $$;

-- Update existing persons to have empty medical_info object if null
UPDATE persons 
SET medical_info = '{}'::jsonb 
WHERE medical_info IS NULL;

-- Add index for medical_info queries
CREATE INDEX IF NOT EXISTS idx_persons_medical_info ON persons USING gin (medical_info);