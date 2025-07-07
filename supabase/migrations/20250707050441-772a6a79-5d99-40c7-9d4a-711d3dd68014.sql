
-- Add country and city columns to bikes table
ALTER TABLE public.bikes 
ADD COLUMN country TEXT,
ADD COLUMN city TEXT;
