import { useState } from 'react';
import { Layers, Minimize2, Maximize2, Eye, EyeOff } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { ObjectType, OBJECT_COLORS } from '../types/urbanTypes';

const LAYER_OPTIONS: { type: ObjectType; label: string }[] = [
  { type: 'building', label: 'Buildings' },
  { type: 'tree', label: 'Trees' },
  { type: 'park', label: 'Parks' },
  { type: 'hospital', label: 'Hospitals' },
  { type: 'fire-station', label: 'Fire Stations' },
  { type: 'water-facility', label: 'Water Facilities' },
  { type: 'store', label: 'Stores' }
];

export function LayerControl() {
  const [isMinimized, setIsMinimized] = useState(false);
  const layerVisibility = useMapStore(state => state.layerVisibility);
  const toggleLayerVisibility = useMapStore(state => state.toggleLayerVisibility);

  if (isMinimized) {
    return (
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Expand Layers"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow-md p-2 z-10 w-52 text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-gray-700" />
          <h2 className="text-base font-semibold text-gray-800">Layers</h2>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Minimize"
        >
          <Minimize2 className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-1.5">
        {LAYER_OPTIONS.map(({ type, label }) => {
          const isVisible = layerVisibility[type];
          return (
            <button
              key={type}
              onClick={() => toggleLayerVisibility(type)}
              className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-all ${isVisible
                ? 'border-gray-200 hover:border-gray-300 bg-white'
                : 'border-gray-200 bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: OBJECT_COLORS[type] }}
                />
                <span className="font-medium">{label}</span>
              </div>
              {isVisible ? (
                <Eye className="w-3.5 h-3.5 text-gray-600" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>

  );
}
