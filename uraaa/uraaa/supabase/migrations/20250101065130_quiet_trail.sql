/*
  # Add unique constraint to api_keys table

  1. Changes
    - Add unique constraint on (user_id, service) combination to api_keys table
    - This ensures each user can only have one API key per service
    - Enables proper upsert functionality

  2. Security
    - Maintains existing RLS policies
    - No security changes needed
*/

-- Add unique constraint for user_id and service combination
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'api_keys_user_id_service_key'
  ) THEN
    ALTER TABLE api_keys 
    ADD CONSTRAINT api_keys_user_id_service_key 
    UNIQUE (user_id, service);
  END IF;
END $$;