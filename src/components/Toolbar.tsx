import { useState } from 'react';
import { Plus, Minimize2, Maximize2, Building, TreeDeciduous, Trees, Activity, Flame, Droplet, Store, Trash2 } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { ObjectType, ShapeType, OBJECT_ICONS } from '../types/urbanTypes';

const OBJECT_OPTIONS: { type: ObjectType; label: string; icon: typeof Building }[] = [
  { type: 'building', label: 'Building', icon: Building },
  { type: 'tree', label: 'Tree', icon: TreeDeciduous },
  { type: 'park', label: 'Park', icon: Trees },
  { type: 'hospital', label: 'Hospital', icon: Activity },
  { type: 'fire-station', label: 'Fire Station', icon: Flame },
  { type: 'water-facility', label: 'Water', icon: Droplet },
  { type: 'store', label: 'Store', icon: Store }
];

const SHAPE_OPTIONS: { shape: ShapeType; label: string }[] = [
  { shape: 'box', label: 'Box' },
  { shape: 'circle', label: 'Circle' },
  { shape: 'polygon', label: 'Polygon' }
];

export function Toolbar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedType, setSelectedType] = useState<ObjectType>('building');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('box');

  const startAddingObject = useMapStore(state => state.startAddingObject);
  const isAddingObject = useMapStore(state => state.isAddingObject);
  const selectedObjectId = useMapStore(state => state.selectedObjectId);
  const deleteObject = useMapStore(state => state.deleteObject);
  const stopAddingObject = useMapStore(state => state.stopAddingObject);

  const handleAddObjectClick = () => {
    if (isAddingObject) {
      stopAddingObject(); // Cancel adding if already in mode
    } else {
      startAddingObject(selectedType, selectedShape);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedObjectId && confirm('Are you sure you want to delete the selected object?')) {
      deleteObject(selectedObjectId);
    }
  };

  if (isMinimized) {
    return (
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Expand Toolbar"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-4 z-10 w-72 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Tools</h2>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Minimize"
        >
          <Minimize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Object Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {OBJECT_OPTIONS.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  selectedType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                } ${isAddingObject ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isAddingObject}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shape
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SHAPE_OPTIONS.map(({ shape, label }) => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  selectedShape === shape
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                } ${isAddingObject ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isAddingObject}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddObjectClick}
          className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-colors shadow-md ${
            isAddingObject
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAddingObject ? (
            <>
              <Trash2 className="w-5 h-5" />
              <span>Cancel Adding</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Add {OBJECT_ICONS[selectedType]} to Map</span>
            </>
          )}
        </button>

        <button
          onClick={handleDeleteSelected}
          disabled={!selectedObjectId}
          className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg transition-colors shadow-md ${
            selectedObjectId
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete Selected Object</span>
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {isAddingObject
            ? `Click on the map to place the new ${OBJECT_ICONS[selectedType]}.`
            : 'Select an object type and shape, then click "Add to Map" to place it.'}
        </p>
        {selectedObjectId && (
          <p className="text-xs text-gray-500 mt-1">
            Object ID: {selectedObjectId} is currently selected.
          </p>
        )}
      </div>
    </div>
  );
}
