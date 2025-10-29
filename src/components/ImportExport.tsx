import { useState, useRef } from 'react';
import { Download, Upload, Minimize2, Maximize2, FileJson, AlertCircle } from 'lucide-react';
import { useMapStore } from '../store/mapStore';
import { objectsToGeoJSON } from '../utils/geoUtils';

export function ImportExport() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const objects = useMapStore(state => state.objects);
  const importData = useMapStore(state => state.importData);

  const handleExportGeoJSON = () => {
    try {
      const geojson = objectsToGeoJSON(objects);
      const blob = new Blob([JSON.stringify(geojson, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `urban-design-${Date.now()}.geojson`;
      a.click();
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      setError('Failed to export GeoJSON');
    }
  };

  const handleExportJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(objects, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `urban-design-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      setError('Failed to export JSON');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        let importedObjects;
        if (data.type === 'FeatureCollection' && data.features) {
          importedObjects = data.features.map((feature: any) => {
            const coords = feature.geometry.type === 'Point'
              ? feature.geometry.coordinates
              : feature.geometry.coordinates[0][0];

            return {
              id: feature.properties.id,
              type: feature.properties.type,
              shape: feature.properties.shape,
              name: feature.properties.name,
              coordinates: coords,
              visible: feature.properties.visible !== false,
              created: feature.properties.created || Date.now(),
              ...(feature.properties.width && { width: feature.properties.width }),
              ...(feature.properties.height && { height: feature.properties.height }),
              ...(feature.properties.rotation !== undefined && { rotation: feature.properties.rotation }),
              ...(feature.properties.radius && { radius: feature.properties.radius }),
              ...(feature.properties.points && { points: feature.properties.points }),
              ...(feature.properties.buildingHeight && { buildingHeight: feature.properties.buildingHeight })
            };
          });
        } else if (Array.isArray(data)) {
          importedObjects = data;
        } else {
          throw new Error('Invalid file format');
        }

        if (importedObjects.length === 0) {
          throw new Error('No valid objects found');
        }

        importData(importedObjects);
        setError(null);
        alert(`Successfully imported ${importedObjects.length} objects`);
      } catch (err) {
        setError('Failed to import file. Please check the format.');
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isMinimized) {
    return (
      <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Expand Import/Export"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-xl p-4 z-10 w-64">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">Data</h2>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Minimize"
        >
          <Minimize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Export</h3>
          <div className="space-y-2">
            <button
              onClick={handleExportGeoJSON}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export GeoJSON
            </button>
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Import</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.geojson"
            onChange={handleImport}
            className="hidden"
            id="file-import"
          />
          <label
            htmlFor="file-import"
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Import File
          </label>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {objects.length} object{objects.length !== 1 ? 's' : ''} in current design
        </p>
      </div>
    </div>
  );
}
