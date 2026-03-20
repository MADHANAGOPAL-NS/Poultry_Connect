import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json'
});

export const useMeasurements = () => {
  return useQuery({
    queryKey: ['measurements'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/measurements`, { headers: getHeaders() });
      if (!res.ok) {
        throw new Error('Error fetching measurements');
      }
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

export const useLatestMeasurements = () => {
  return useQuery({
    queryKey: ['latest-measurements'],
    queryFn: async () => {
      // In a real app we would have an endpoint for latest measurements
      // For now we just fetch the standard measurements and slice them client side for the example
      const res = await fetch(`${API_URL}/measurements?limit=10`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch latest measurements');
      const data = await res.json();
      
      const latestMeasurements = [];
      const sensorTypes = ['temperature', 'humidity', 'air_quality', 'sound_level'];
      
      for (const sensorType of sensorTypes) {
        const matching = data.find((d: any) => d.sensorType === sensorType || d.sensor_type === sensorType);
        if (matching) latestMeasurements.push(matching);
      }

      return latestMeasurements;
    },
    refetchInterval: 10000, // Refetch every 10 seconds for latest data
  });
};
