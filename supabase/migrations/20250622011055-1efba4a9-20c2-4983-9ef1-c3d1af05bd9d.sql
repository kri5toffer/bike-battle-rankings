
-- Create a contacts table to store contact form submissions
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to insert contact messages
CREATE POLICY "Anyone can submit contact messages" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated users can view contacts" ON public.contacts FOR SELECT USING (false);
