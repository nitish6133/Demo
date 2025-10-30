import { useState } from 'react';
import { Plus, Minimize2, Maximize2, Building, TreeDeciduous, Trees, Activity, Flame, Droplet, Store, Trash2 } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { ObjectType, ShapeType } from '../types/urbanTypes';

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
    <div className="absolute top-3 left-3 bg-white rounded-lg shadow-md p-2 z-10 w-56 max-h-[70vh] overflow-y-auto text-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-800">Tools</h2>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Minimize"
        >
          <Minimize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Object Type
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {OBJECT_OPTIONS.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-1.5 p-2 rounded-md border text-xs transition-all ${selectedType === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  } ${isAddingObject ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isAddingObject}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Shape
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {SHAPE_OPTIONS.map(({ shape, label }) => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`p-2 rounded-md border text-xs font-medium transition-all ${selectedShape === shape
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
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${isAddingObject
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {isAddingObject ? (
            <>
              <Trash2 className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add
            </>
          )}
        </button>

        <button
          onClick={handleDeleteSelected}
          disabled={!selectedObjectId}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${selectedObjectId
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
