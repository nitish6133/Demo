import { useState, useEffect } from 'react';
import { X, Trash2, Move, Maximize } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { BoxObject, CircleObject, PolygonObject } from '../types/urbanTypes';

export function ObjectEditor() {
  const selectedObjectId = useMapStore(state => state.selectedObjectId);
  const objects = useMapStore(state => state.objects);
  const updateObject = useMapStore(state => state.updateObject);
  const deleteObject = useMapStore(state => state.deleteObject);
  const selectObject = useMapStore(state => state.selectObject);

  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  const [localValues, setLocalValues] = useState<any>({});

  useEffect(() => {
    if (selectedObject) {
      setLocalValues({
        name: selectedObject.name,
        ...(selectedObject.shape === 'box' && {
          width: (selectedObject as BoxObject).width,
          height: (selectedObject as BoxObject).height,
          rotation: (selectedObject as BoxObject).rotation || 0,
          buildingHeight: (selectedObject as BoxObject).buildingHeight || 30
        }),
        ...(selectedObject.shape === 'circle' && {
          radius: (selectedObject as CircleObject).radius
        })
      });
    }
  }, [selectedObject]);

  if (!selectedObject) return null;

  const handleUpdate = (field: string, value: any) => {
    setLocalValues((prev: any) => ({ ...prev, [field]: value }));
    updateObject(selectedObject.id, { [field]: value });
  };

  const handleMove = (dx: number, dy: number) => {
    const [lng, lat] = selectedObject.coordinates;
    updateObject(selectedObject.id, {
      coordinates: [lng + dx, lat + dy]
    });
  };

  const handleDelete = () => {
    if (confirm(`Delete ${selectedObject.name}?`)) {
      deleteObject(selectedObject.id);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 z-10 w-80 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Edit Object</h2>
        <button
          onClick={() => selectObject(null)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Close"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={localValues.name || ''}
            onChange={(e) => handleUpdate('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 capitalize">
            {selectedObject.type.replace('-', ' ')}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
          <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 capitalize">
            {selectedObject.shape}
          </div>
        </div>

        {selectedObject.shape === 'box' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width: {localValues.width?.toFixed(4)}
              </label>
              <input
                type="range"
                min="0.0001"
                max="0.005"
                step="0.0001"
                value={localValues.width || 0.001}
                onChange={(e) => handleUpdate('width', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height: {localValues.height?.toFixed(4)}
              </label>
              <input
                type="range"
                min="0.0001"
                max="0.005"
                step="0.0001"
                value={localValues.height || 0.001}
                onChange={(e) => handleUpdate('height', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation: {localValues.rotation?.toFixed(0)}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={localValues.rotation || 0}
                onChange={(e) => handleUpdate('rotation', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {(selectedObject.type === 'building' ||
              selectedObject.type === 'hospital' ||
              selectedObject.type === 'fire-station' ||
              selectedObject.type === 'store') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Height: {localValues.buildingHeight?.toFixed(0)}m
                </label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={localValues.buildingHeight || 30}
                  onChange={(e) => handleUpdate('buildingHeight', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </>
        )}

        {selectedObject.shape === 'circle' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Radius: {localValues.radius?.toFixed(4)}
            </label>
            <input
              type="range"
              min="0.0001"
              max="0.003"
              step="0.0001"
              value={localValues.radius || 0.0005}
              onChange={(e) => handleUpdate('radius', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Move className="w-4 h-4 inline mr-1" />
            Move Object
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleMove(0, 0.0001)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
            >
              ↑
            </button>
            <div />
            <div />
            <button
              onClick={() => handleMove(-0.0001, 0)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
            >
              ←
            </button>
            <button
              onClick={() => handleMove(0, -0.0001)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
            >
              ↓
            </button>
            <button
              onClick={() => handleMove(0.0001, 0)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
            >
              →
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
          <button
            onClick={() => updateObject(selectedObject.id, { visible: !selectedObject.visible })}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              selectedObject.visible
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {selectedObject.visible ? 'Visible' : 'Hidden'}
          </button>
        </div>

        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Object
        </button>
      </div>
    </div>
  );
}
