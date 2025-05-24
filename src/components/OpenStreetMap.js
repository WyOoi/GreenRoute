'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default markers in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const originIcon = createCustomIcon('#10b981'); // Green
const destinationIcon = createCustomIcon('#ef4444'); // Red
const airQualityIcon = (value) => {
  const color = value <= 12 ? '#10b981' : value <= 35 ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    className: 'air-quality-marker',
    html: `<div style="background-color: ${color}; color: white; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${value}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to handle map events
function MapEventHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Component to handle map view updates
function MapViewController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
}

export default function OpenStreetMap({ 
  center = [37.7749, -122.4194], 
  zoom = 12, 
  onMapClick,
  origin,
  destination,
  showAirQuality = true,
  routes = []
}) {
  const mapRef = useRef(null);

  // Mock air quality data
  const airQualityData = [
    { id: 1, lat: 37.7749, lng: -122.4194, pm25: 12, status: 'good' },
    { id: 2, lat: 37.7849, lng: -122.4094, pm25: 25, status: 'moderate' },
    { id: 3, lat: 37.7649, lng: -122.4294, pm25: 45, status: 'unhealthy' },
    { id: 4, lat: 37.7549, lng: -122.4394, pm25: 8, status: 'good' },
    { id: 5, lat: 37.7849, lng: -122.4594, pm25: 35, status: 'moderate' },
  ];

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map event handler */}
        <MapEventHandler onMapClick={onMapClick} />
        
        {/* Map view controller */}
        <MapViewController center={center} zoom={zoom} />
        
        {/* Air quality markers */}
        {showAirQuality && airQualityData.map((sensor) => (
          <Marker 
            key={sensor.id} 
            position={[sensor.lat, sensor.lng]} 
            icon={airQualityIcon(sensor.pm25)}
          >
            <Popup>
              <div className="text-center">
                <p className="font-medium">PM2.5: {sensor.pm25} μg/m³</p>
                <p className="text-gray-600 capitalize">{sensor.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Origin marker */}
        {origin && (
          <Marker position={[origin.latitude, origin.longitude]} icon={originIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-medium">Starting Point</p>
                <p className="text-sm text-gray-600">
                  {origin.latitude.toFixed(4)}, {origin.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Destination marker */}
        {destination && (
          <Marker position={[destination.latitude, destination.longitude]} icon={destinationIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-medium">Destination</p>
                <p className="text-sm text-gray-600">
                  {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
} 