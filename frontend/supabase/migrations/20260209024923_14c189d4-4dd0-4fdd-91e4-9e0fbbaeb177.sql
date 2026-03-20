-- Create prediction_history table to store AI health predictions
CREATE TABLE public.prediction_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    temperature NUMERIC NOT NULL,
    humidity NUMERIC NOT NULL,
    ammonia NUMERIC NOT NULL,
    co2 NUMERIC NOT NULL,
    sound NUMERIC NOT NULL,
    movement NUMERIC NOT NULL,
    stress_level TEXT NOT NULL,
    health_status TEXT NOT NULL,
    confidence NUMERIC NOT NULL,
    analysis TEXT,
    recommendations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view prediction history
CREATE POLICY "Anyone can view prediction history"
ON public.prediction_history
FOR SELECT
USING (true);

-- Allow anyone to insert predictions
CREATE POLICY "Anyone can insert predictions"
ON public.prediction_history
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries on created_at
CREATE INDEX idx_prediction_history_created_at ON public.prediction_history(created_at DESC);