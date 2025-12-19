-- Migration: Add school_id column to teacher table
-- This migration adds the missing school_id column to the teacher table

-- Add school_id column to teacher table
ALTER TABLE teacher 
ADD COLUMN school_id UUID REFERENCES school(school_id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_teacher_school_id ON teacher(school_id);

-- If there are existing teachers without school_id, you may need to update them
-- This is commented out as it requires specific school_id values
-- UPDATE teacher SET school_id = 'your-school-uuid-here' WHERE school_id IS NULL;
