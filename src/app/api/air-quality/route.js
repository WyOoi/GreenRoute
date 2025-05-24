import { NextResponse } from 'next/server';

// Mock air quality data - in production, this would fetch from real APIs
const mockSensors = [
  { id: 1, lat: 37.7749, lon: -122.4194, pm25: 12, no2: 15, o3: 45, timestamp: new Date().toISOString() },
  { id: 2, lat: 37.7849, lon: -122.4094, pm25: 25, no2: 28, o3: 52, timestamp: new Date().toISOString() },
  { id: 3, lat: 37.7649, lon: -122.4294, pm25: 45, no2: 42, o3: 78, timestamp: new Date().toISOString() },
  { id: 4, lat: 37.7549, lon: -122.4394, pm25: 8, no2: 12, o3: 38, timestamp: new Date().toISOString() },
  { id: 5, lat: 37.7849, lon: -122.4594, pm25: 35, no2: 38, o3: 65, timestamp: new Date().toISOString() },
  { id: 6, lat: 37.7949, lon: -122.4094, pm25: 18, no2: 22, o3: 48, timestamp: new Date().toISOString() },
  { id: 7, lat: 37.7649, lon: -122.4494, pm25: 52, no2: 48, o3: 82, timestamp: new Date().toISOString() },
  { id: 8, lat: 37.7449, lon: -122.4194, pm25: 15, no2: 18, o3: 42, timestamp: new Date().toISOString() },
];

function getAirQualityIndex(pm25, no2, o3) {
  // Simplified AQI calculation
  const pm25Index = Math.min(Math.round((pm25 / 35) * 100), 300);
  const no2Index = Math.min(Math.round((no2 / 100) * 100), 200);
  const o3Index = Math.min(Math.round((o3 / 120) * 100), 200);
  
  return Math.max(pm25Index, no2Index, o3Index);
}

function getAirQualityStatus(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function isWithinBounds(sensor, bbox) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return (
    sensor.lon >= minLon &&
    sensor.lon <= maxLon &&
    sensor.lat >= minLat &&
    sensor.lat <= maxLat
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bbox = searchParams.get('bbox');
    
    if (!bbox) {
      return NextResponse.json({ error: 'bbox parameter is required' }, { status: 400 });
    }

    const bounds = bbox.split(',').map(parseFloat);
    if (bounds.length !== 4) {
      return NextResponse.json({ error: 'bbox must have 4 coordinates: minLon,minLat,maxLon,maxLat' }, { status: 400 });
    }

    // Filter sensors within bounding box
    const sensorsInBounds = mockSensors.filter(sensor => isWithinBounds(sensor, bounds));

    // Process sensor data
    const processedSensors = sensorsInBounds.map(sensor => {
      const aqi = getAirQualityIndex(sensor.pm25, sensor.no2, sensor.o3);
      return {
        id: sensor.id,
        latitude: sensor.lat,
        longitude: sensor.lon,
        measurements: {
          pm25: sensor.pm25,
          no2: sensor.no2,
          o3: sensor.o3,
          aqi: aqi
        },
        status: getAirQualityStatus(aqi),
        timestamp: sensor.timestamp,
        location: `Sensor ${sensor.id}`
      };
    });

    // Add some random variation to simulate real-time updates
    processedSensors.forEach(sensor => {
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      sensor.measurements.pm25 = Math.max(0, sensor.measurements.pm25 * (1 + variation));
      sensor.measurements.aqi = getAirQualityIndex(
        sensor.measurements.pm25, 
        sensor.measurements.no2, 
        sensor.measurements.o3
      );
      sensor.status = getAirQualityStatus(sensor.measurements.aqi);
    });

    return NextResponse.json({
      sensors: processedSensors,
      metadata: {
        total: processedSensors.length,
        bbox: bounds,
        timestamp: new Date().toISOString(),
        units: {
          pm25: 'μg/m³',
          no2: 'ppb',
          o3: 'ppb',
          aqi: 'index'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 