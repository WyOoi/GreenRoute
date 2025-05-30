'use client';

import { useState, useCallback, useEffect } from 'react';
import { MapPin, Route, Sliders, Leaf, Shield, Thermometer, Clock } from 'lucide-react';
import RouteInputForm from '@/components/RouteInputForm';
import RouteOptionsPanel from '@/components/RouteOptionsPanel';
import PreferenceSlider from '@/components/PreferenceSlider';
import OpenStreetMap from '@/components/OpenStreetMap';

export default function SearchPage() {
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]);
  const [mapZoom, setMapZoom] = useState(12);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(true); // Leaflet loads faster
  const [preferences, setPreferences] = useState({
    pollution: 0.4,
    shade: 0.4,
    distance: 0.2
  });
  const [showLayers, setShowLayers] = useState({
    airQuality: true,
    treeCanopy: true,
    temperature: false
  });

  const handleMapClick = useCallback((latlng) => {
    const { lat, lng } = latlng;
    
    if (!origin) {
      setOrigin({ latitude: lat, longitude: lng });
    } else if (!destination) {
      setDestination({ latitude: lat, longitude: lng });
    } else {
      // Reset and start over
      setOrigin({ latitude: lat, longitude: lng });
      setDestination(null);
      setRoutes([]);
    }
  }, [origin, destination]);

  const computeRoutes = async () => {
    if (!origin || !destination) return;

    setLoading(true);
    try {
      const response = await fetch('/api/route-compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          weights: preferences
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRoutes(data.routes || []);
      }
    } catch (error) {
      console.error('Error computing routes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (origin && destination) {
      computeRoutes();
    }
  }, [origin, destination, preferences]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">GreenRoute</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLayers(prev => ({ ...prev, airQuality: !prev.airQuality }))}
              className={`p-2 rounded-md ${showLayers.airQuality ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              title="Toggle Air Quality Layer"
            >
              <Shield className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowLayers(prev => ({ ...prev, treeCanopy: !prev.treeCanopy }))}
              className={`p-2 rounded-md ${showLayers.treeCanopy ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              title="Toggle Tree Canopy Layer"
            >
              <Leaf className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowLayers(prev => ({ ...prev, temperature: !prev.temperature }))}
              className={`p-2 rounded-md ${showLayers.temperature ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              title="Toggle Temperature Layer"
            >
              <Thermometer className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg z-10 flex flex-col">
          {/* Route Input Form */}
          <div className="p-4 border-b border-gray-200">
            <RouteInputForm
              origin={origin}
              destination={destination}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onClearRoute={() => {
                setOrigin(null);
                setDestination(null);
                setRoutes([]);
              }}
            />
          </div>

          {/* Preferences */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center mb-3">
              <Sliders className="h-4 w-4 text-gray-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">Route Preferences</span>
            </div>
            <PreferenceSlider
              preferences={preferences}
              onChange={setPreferences}
            />
          </div>

          {/* Route Options */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Computing optimal routes...</p>
              </div>
            )}
            
            {routes.length > 0 && (
              <RouteOptionsPanel routes={routes} />
            )}

            {!loading && routes.length === 0 && origin && destination && (
              <div className="p-4 text-center text-gray-500">
                <Route className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No routes found. Try different locations.</p>
              </div>
            )}

            {!origin && !destination && (
              <div className="p-4 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click on the map to set your starting point</p>
              </div>
            )}

            {origin && !destination && (
              <div className="p-4 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click on the map to set your destination</p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative map-container">
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          
          <OpenStreetMap
            center={mapCenter}
            zoom={mapZoom}
            onMapClick={handleMapClick}
            origin={origin}
            destination={destination}
            showAirQuality={showLayers.airQuality}
            routes={routes}
          />

          {/* Instructions overlay */}
          {!origin && (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Get Started</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Click anywhere on the map to set your starting point, then click again to set your destination.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 