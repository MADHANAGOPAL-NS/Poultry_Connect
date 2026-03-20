-- Create measurements table for IoT sensor data
CREATE TABLE public.measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read measurements (public dashboard data)
CREATE POLICY "Anyone can view measurements" 
ON public.measurements 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert measurements
CREATE POLICY "Authenticated users can insert measurements" 
ON public.measurements 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_measurements_sensor_type ON public.measurements(sensor_type);
CREATE INDEX idx_measurements_recorded_at ON public.measurements(recorded_at DESC);