import { useState } from 'react';
import { MapPin, X, Search, Navigation } from 'lucide-react';

export default function RouteInputForm({ 
  origin, 
  destination, 
  onOriginChange, 
  onDestinationChange, 
  onClearRoute 
}) {
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');

  const formatCoordinate = (coord) => {
    if (!coord) return '';
    return `${coord.latitude.toFixed(4)}, ${coord.longitude.toFixed(4)}`;
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onOriginChange({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Plan Your Route</h2>
        {(origin || destination) && (
          <button
            onClick={onClearRoute}
            className="text-gray-400 hover:text-gray-600"
            title="Clear route"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Origin Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="h-4 w-4 inline mr-1 text-green-600" />
          From
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={origin ? formatCoordinate(origin) : "Click on map or enter address"}
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            readOnly={!!origin}
          />
          {!origin && (
            <button
              onClick={handleCurrentLocation}
              className="absolute right-2 top-2 text-gray-400 hover:text-green-600"
              title="Use current location"
            >
              <Navigation className="h-4 w-4" />
            </button>
          )}
        </div>
        {origin && (
          <p className="text-xs text-gray-500">
            Click on map again to change location
          </p>
        )}
      </div>

      {/* Destination Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="h-4 w-4 inline mr-1 text-red-600" />
          To
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={destination ? formatCoordinate(destination) : "Click on map or enter address"}
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            readOnly={!!destination}
          />
          <Search className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
        </div>
        {destination && (
          <p className="text-xs text-gray-500">
            Click on map to change destination
          </p>
        )}
      </div>

      {/* Route Status */}
      {origin && destination && (
        <div className="mt-4 p-3 bg-green-50 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                Route points set! Computing optimal paths...
              </p>
            </div>
          </div>
        </div>
      )}

      {origin && !destination && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                Starting point set. Click on the map to set your destination.
              </p>
            </div>
          </div>
        </div>
      )}

      {!origin && !destination && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">
                Click anywhere on the map to start planning your green route.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 