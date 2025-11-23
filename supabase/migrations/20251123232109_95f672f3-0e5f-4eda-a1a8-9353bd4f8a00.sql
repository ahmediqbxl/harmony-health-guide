-- Create favorite_remedies table
CREATE TABLE public.favorite_remedies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  potency TEXT NOT NULL,
  description TEXT NOT NULL,
  dosage TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name, potency)
);

-- Enable Row Level Security
ALTER TABLE public.favorite_remedies ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own favorite remedies"
ON public.favorite_remedies
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorite remedies"
ON public.favorite_remedies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite remedies"
ON public.favorite_remedies
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_favorite_remedies_user_id ON public.favorite_remedies(user_id);