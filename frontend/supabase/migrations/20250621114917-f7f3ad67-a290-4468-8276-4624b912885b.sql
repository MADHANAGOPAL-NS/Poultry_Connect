
-- Create a table for storing all sensor measurements
CREATE TABLE public.measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_type TEXT NOT NULL CHECK (sensor_type IN ('temperature', 'humidity', 'air_quality', 'sound_level')),
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  location TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add an index for faster queries by sensor type and time
CREATE INDEX idx_measurements_sensor_type_time ON public.measurements(sensor_type, recorded_at DESC);

-- Add an index for location-based queries
CREATE INDEX idx_measurements_location ON public.measurements(location);

-- Enable Row Level Security (RLS)
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since this is monitoring data)
CREATE POLICY "Allow public read access to measurements" 
  ON public.measurements 
  FOR SELECT 
  TO public 
  USING (true);

-- Create policy for authenticated users to insert measurements
CREATE POLICY "Allow authenticated users to insert measurements" 
  ON public.measurements 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
