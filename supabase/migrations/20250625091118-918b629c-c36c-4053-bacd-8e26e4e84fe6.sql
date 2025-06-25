
-- Add most_often_ridden_route column to bikes table
ALTER TABLE public.bikes 
ADD COLUMN most_often_ridden_route TEXT;
