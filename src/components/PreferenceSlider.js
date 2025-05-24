import { Shield, Leaf, Route, RotateCcw } from 'lucide-react';

export default function PreferenceSlider({ preferences, onChange }) {
  const handleSliderChange = (key, value) => {
    const newValue = value / 100;
    const otherKeys = Object.keys(preferences).filter(k => k !== key);
    const remainingTotal = 1 - newValue;
    
    // Distribute the remaining weight proportionally among other preferences
    const currentOtherTotal = otherKeys.reduce((sum, k) => sum + preferences[k], 0);
    
    const newPreferences = { ...preferences, [key]: newValue };
    
    if (currentOtherTotal > 0) {
      otherKeys.forEach(k => {
        newPreferences[k] = (preferences[k] / currentOtherTotal) * remainingTotal;
      });
    } else {
      // If other totals are 0, distribute equally
      const equalShare = remainingTotal / otherKeys.length;
      otherKeys.forEach(k => {
        newPreferences[k] = equalShare;
      });
    }
    
    onChange(newPreferences);
  };

  const resetPreferences = () => {
    onChange({
      pollution: 0.4,
      shade: 0.4,
      distance: 0.2
    });
  };

  const getSliderColor = (key) => {
    switch (key) {
      case 'pollution':
        return 'accent-blue-600';
      case 'shade':
        return 'accent-green-600';
      case 'distance':
        return 'accent-purple-600';
      default:
        return 'accent-gray-600';
    }
  };

  const getIcon = (key) => {
    switch (key) {
      case 'pollution':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'shade':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'distance':
        return <Route className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getLabel = (key) => {
    switch (key) {
      case 'pollution':
        return 'Clean Air Priority';
      case 'shade':
        return 'Shade Priority';
      case 'distance':
        return 'Distance Priority';
      default:
        return key;
    }
  };

  const getDescription = (key) => {
    switch (key) {
      case 'pollution':
        return 'Avoid polluted areas';
      case 'shade':
        return 'Maximize tree coverage';
      case 'distance':
        return 'Minimize travel distance';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Adjust Priorities</span>
        <button
          onClick={resetPreferences}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          title="Reset to defaults"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </button>
      </div>

      {Object.entries(preferences).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getIcon(key)}
              <span className="ml-2 text-sm text-gray-700">{getLabel(key)}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(value * 100)}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(value * 100)}
            onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${getSliderColor(key)}`}
          />
          
          <p className="text-xs text-gray-500">{getDescription(key)}</p>
        </div>
      ))}

      {/* Quick Preset Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2">Quick Presets:</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onChange({ pollution: 0.7, shade: 0.2, distance: 0.1 })}
            className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200"
          >
            Clean Air
          </button>
          <button
            onClick={() => onChange({ pollution: 0.2, shade: 0.7, distance: 0.1 })}
            className="px-2 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded border border-green-200"
          >
            Max Shade
          </button>
          <button
            onClick={() => onChange({ pollution: 0.1, shade: 0.1, distance: 0.8 })}
            className="px-2 py-1 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded border border-purple-200"
          >
            Shortest
          </button>
        </div>
      </div>

      {/* Total Check */}
      <div className="mt-2 p-2 bg-gray-50 rounded text-center">
        <span className="text-xs text-gray-600">
          Total: {Math.round((preferences.pollution + preferences.shade + preferences.distance) * 100)}%
        </span>
      </div>
    </div>
  );
} 