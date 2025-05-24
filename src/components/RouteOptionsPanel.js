import { Shield, Leaf, Target, Clock, Route, TrendingUp } from 'lucide-react';

export default function RouteOptionsPanel({ routes }) {
  const getRouteIcon = (category) => {
    switch (category) {
      case 'low-pollution':
        return <Shield className="h-5 w-5 text-blue-600" />;
      case 'most-shaded':
        return <Leaf className="h-5 w-5 text-green-600" />;
      case 'balanced':
        return <Target className="h-5 w-5 text-purple-600" />;
      default:
        return <Route className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRouteColor = (category) => {
    switch (category) {
      case 'low-pollution':
        return 'border-l-blue-500 bg-blue-50';
      case 'most-shaded':
        return 'border-l-green-500 bg-green-50';
      case 'balanced':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getRouteTitle = (category) => {
    switch (category) {
      case 'low-pollution':
        return 'Clean Air Route';
      case 'most-shaded':
        return 'Shaded Route';
      case 'balanced':
        return 'Balanced Route';
      default:
        return 'Route';
    }
  };

  const getRouteDescription = (category) => {
    switch (category) {
      case 'low-pollution':
        return 'Minimizes exposure to air pollution';
      case 'most-shaded':
        return 'Maximizes tree coverage and shade';
      case 'balanced':
        return 'Optimal balance of all factors';
      default:
        return 'Standard route';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatScore = (score) => {
    return Math.round(score * 100);
  };

  const formatTime = (timeMinutes) => {
    const hours = Math.floor(timeMinutes / 60);
    const minutes = Math.round(timeMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!routes || routes.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Route Options</h3>
      <div className="space-y-3">
        {routes.map((route, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow ${getRouteColor(route.category)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center mb-2">
                {getRouteIcon(route.category)}
                <div className="ml-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {getRouteTitle(route.category)}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {getRouteDescription(route.category)}
                  </p>
                </div>
              </div>
              {index === 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Recommended
                </span>
              )}
            </div>

            {/* Route Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Route className="h-3 w-3 text-gray-500" />
                  <span className="ml-1 text-xs text-gray-500">Distance</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {route.metrics?.distance_km?.toFixed(1) || '0.0'} km
                </span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="ml-1 text-xs text-gray-500">Time</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatTime(route.metrics?.time_minutes || 0)}
                </span>
              </div>
            </div>

            {/* Environmental Scores */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 text-blue-600" />
                  <span className="ml-1 text-xs text-gray-600">Air Quality</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(1 - (route.metrics?.pollution_score || 0))}`}>
                  {formatScore(1 - (route.metrics?.pollution_score || 0))}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Leaf className="h-3 w-3 text-green-600" />
                  <span className="ml-1 text-xs text-gray-600">Shade Coverage</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(route.metrics?.shade_score || 0)}`}>
                  {formatScore(route.metrics?.shade_score || 0)}%
                </span>
              </div>

              {route.metrics?.carbon_savings && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span className="ml-1 text-xs text-gray-600">CO₂ Saved</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-600">
                    {route.metrics.carbon_savings} kg
                  </span>
                </div>
              )}
            </div>

            {/* Progress bars for visual representation */}
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Air Quality</span>
                  <span>{formatScore(1 - (route.metrics?.pollution_score || 0))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${formatScore(1 - (route.metrics?.pollution_score || 0))}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Shade Coverage</span>
                  <span>{formatScore(route.metrics?.shade_score || 0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full" 
                    style={{ width: `${formatScore(route.metrics?.shade_score || 0)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          💡 Higher scores indicate cleaner air and better shade coverage
        </p>
      </div>
    </div>
  );
} 