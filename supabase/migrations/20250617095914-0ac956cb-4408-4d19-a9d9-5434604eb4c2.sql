
-- Create bikes table to store bike photos and details
CREATE TABLE public.bikes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  bike_name TEXT NOT NULL,
  bike_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  description TEXT,
  rating INTEGER NOT NULL DEFAULT 1200,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table to track voting history
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  winner_id UUID REFERENCES public.bikes(id) ON DELETE CASCADE NOT NULL,
  loser_id UUID REFERENCES public.bikes(id) ON DELETE CASCADE NOT NULL,
  voted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (since we're making this public for now, we'll allow all operations)
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Anyone can view bikes" ON public.bikes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bikes" ON public.bikes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bike ratings" ON public.bikes FOR UPDATE USING (true);

CREATE POLICY "Anyone can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes" ON public.votes FOR INSERT WITH CHECK (true);

-- Create storage bucket for bike images
INSERT INTO storage.buckets (id, name, public) VALUES ('bike-images', 'bike-images', true);

-- Create storage policies for public access
CREATE POLICY "Anyone can upload bike images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bike-images');
CREATE POLICY "Anyone can view bike images" ON storage.objects FOR SELECT USING (bucket_id = 'bike-images');
