import { useState, useMemo } from 'react';
import { BarChart3, Minimize2, Maximize2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { calculateAnalytics } from '../utils/geoUtils';

export function AnalyticsPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const objects = useMapStore(state => state.objects);

  const analytics = useMemo(() => calculateAnalytics(objects), [objects]);

  if (isMinimized) {
    return (
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Expand Analytics"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 z-10 w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">Analytics</h2>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Minimize"
        >
          <Minimize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Total Objects</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalObjects}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Total Area</p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.totalArea.toFixed(6)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Green Area</span>
              <span className="text-sm font-bold text-green-600">
                {analytics.greenPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(analytics.greenPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Water Area</span>
              <span className="text-sm font-bold text-blue-600">
                {analytics.waterPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(analytics.waterPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg p-4 border-2 transition-all ${
            analytics.compliant
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {analytics.compliant ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3
                className={`font-semibold mb-1 ${
                  analytics.compliant ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {analytics.compliant ? 'Policy Compliant' : 'Non-Compliant'}
              </h3>
              <p
                className={`text-sm ${
                  analytics.compliant ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {analytics.compliant
                  ? 'Your design meets the 15% green and water minimum requirement.'
                  : `Your design needs ${(
                      15 -
                      (analytics.greenPercentage + analytics.waterPercentage)
                    ).toFixed(1)}% more green or water area to comply.`}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Breakdown</h4>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Green Area:</span>
              <span className="font-medium text-gray-900">
                {analytics.greenArea.toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Water Area:</span>
              <span className="font-medium text-gray-900">
                {analytics.waterArea.toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Combined:</span>
              <span className="font-medium text-gray-900">
                {(analytics.greenPercentage + analytics.waterPercentage).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
