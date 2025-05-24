import { Marker, Source, Layer } from 'react-map-gl/mapbox';
import { MapPin, AlertTriangle, Leaf } from 'lucide-react';

export default function EnvironmentalLayers({ 
  showLayers, 
  routes, 
  origin, 
  destination 
}) {
  // Mock air quality data - in a real app, this would come from an API
  const airQualityData = [
    { id: 1, longitude: -122.4194, latitude: 37.7749, pm25: 12, status: 'good' },
    { id: 2, longitude: -122.4094, latitude: 37.7849, pm25: 25, status: 'moderate' },
    { id: 3, longitude: -122.4294, latitude: 37.7649, pm25: 45, status: 'unhealthy' },
    { id: 4, longitude: -122.4394, latitude: 37.7549, pm25: 8, status: 'good' },
    { id: 5, longitude: -122.4594, latitude: 37.7849, pm25: 35, status: 'moderate' },
  ];

  const getAirQualityColor = (pm25) => {
    if (pm25 <= 12) return '#10b981'; // Good - Green
    if (pm25 <= 35) return '#f59e0b'; // Moderate - Yellow
    if (pm25 <= 55) return '#ef4444'; // Unhealthy - Red
    return '#7c3aed'; // Very Unhealthy - Purple
  };

  const getAirQualityStatus = (pm25) => {
    if (pm25 <= 12) return 'Good';
    if (pm25 <= 35) return 'Moderate';
    if (pm25 <= 55) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  // Mock tree canopy data as GeoJSON
  const treeCanopyData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-122.425, 37.770],
            [-122.420, 37.770],
            [-122.420, 37.775],
            [-122.425, 37.775],
            [-122.425, 37.770]
          ]]
        },
        properties: {
          canopyCoverage: 0.8
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-122.415, 37.765],
            [-122.410, 37.765],
            [-122.410, 37.770],
            [-122.415, 37.770],
            [-122.415, 37.765]
          ]]
        },
        properties: {
          canopyCoverage: 0.6
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-122.435, 37.755],
            [-122.430, 37.755],
            [-122.430, 37.760],
            [-122.435, 37.760],
            [-122.435, 37.755]
          ]]
        },
        properties: {
          canopyCoverage: 0.9
        }
      }
    ]
  };

  // Route colors for different categories
  const getRouteColor = (category) => {
    switch (category) {
      case 'low-pollution':
        return '#3b82f6'; // Blue
      case 'most-shaded':
        return '#10b981'; // Green
      case 'balanced':
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Gray
    }
  };

  return (
    <>
      {/* Tree Canopy Layer */}
      {showLayers.treeCanopy && (
        <Source id="tree-canopy" type="geojson" data={treeCanopyData}>
          <Layer
            id="tree-canopy-fill"
            type="fill"
            paint={{
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'canopyCoverage'],
                0, '#f3f4f6',
                0.3, '#d1fae5',
                0.6, '#86efac',
                0.9, '#22c55e'
              ],
              'fill-opacity': 0.6
            }}
          />
          <Layer
            id="tree-canopy-outline"
            type="line"
            paint={{
              'line-color': '#059669',
              'line-width': 1,
              'line-opacity': 0.8
            }}
          />
        </Source>
      )}

      {/* Air Quality Sensors */}
      {showLayers.airQuality && airQualityData.map((sensor) => (
        <Marker
          key={sensor.id}
          longitude={sensor.longitude}
          latitude={sensor.latitude}
          anchor="center"
        >
          <div className="relative">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: getAirQualityColor(sensor.pm25) }}
            >
              <span className="text-xs font-bold text-white">
                {sensor.pm25}
              </span>
            </div>
            {/* Tooltip on hover */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 text-xs opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <div className="text-center">
                <p className="font-medium">PM2.5: {sensor.pm25} μg/m³</p>
                <p className="text-gray-600">{getAirQualityStatus(sensor.pm25)}</p>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </div>
          </div>
        </Marker>
      ))}

      {/* Routes */}
      {routes.map((route, index) => {
        if (!route.polyline) return null;
        
        // In a real app, you'd decode the polyline here
        // For demo purposes, we'll create a simple line
        const routeData = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [origin?.longitude || -122.4194, origin?.latitude || 37.7749],
                [destination?.longitude || -122.4094, destination?.latitude || 37.7849]
              ]
            },
            properties: {
              category: route.category
            }
          }]
        };

        return (
          <Source key={`route-${index}`} id={`route-${index}`} type="geojson" data={routeData}>
            <Layer
              id={`route-line-${index}`}
              type="line"
              paint={{
                'line-color': getRouteColor(route.category),
                'line-width': index === 0 ? 4 : 3,
                'line-opacity': index === 0 ? 1 : 0.7
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round'
              }}
            />
          </Source>
        );
      })}

      {/* Origin Marker */}
      {origin && (
        <Marker longitude={origin.longitude} latitude={origin.latitude} anchor="center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg">
            <MapPin className="h-4 w-4 text-white" />
          </div>
        </Marker>
      )}

      {/* Destination Marker */}
      {destination && (
        <Marker longitude={destination.longitude} latitude={destination.latitude} anchor="center">
          <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-lg">
            <MapPin className="h-4 w-4 text-white" />
          </div>
        </Marker>
      )}

      {/* Temperature Layer (if enabled) */}
      {showLayers.temperature && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow p-3 text-sm max-w-xs">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
            <span className="font-medium">Temperature Alert</span>
          </div>
          <p className="text-gray-600 text-xs">
            High temperatures (32°C+) detected in downtown area. Consider shaded routes.
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-3 text-xs">
        <h4 className="font-medium mb-2">Legend</h4>
        
        {showLayers.airQuality && (
          <div className="mb-2">
            <p className="font-medium text-gray-700 mb-1">Air Quality (PM2.5)</p>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Good (0-12)</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Moderate (13-35)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Unhealthy (36+)</span>
            </div>
          </div>
        )}

        {showLayers.treeCanopy && (
          <div className="mb-2">
            <p className="font-medium text-gray-700 mb-1">Tree Coverage</p>
            <div className="flex items-center space-x-2">
              <Leaf className="h-3 w-3 text-green-500" />
              <span>Shaded areas</span>
            </div>
          </div>
        )}

        {routes.length > 0 && (
          <div>
            <p className="font-medium text-gray-700 mb-1">Routes</p>
            {routes.map((route, index) => (
              <div key={index} className="flex items-center space-x-2 mb-1">
                <div 
                  className="w-3 h-1 rounded"
                  style={{ backgroundColor: getRouteColor(route.category) }}
                ></div>
                <span>{route.category.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 