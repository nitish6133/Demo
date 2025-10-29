import { Undo, Redo, RotateCcw, Trash2 } from 'lucide-react';
import { useMapStore } from '../store/mapStore';

export function ControlBar() {
  const undo = useMapStore(state => state.undo);
  const redo = useMapStore(state => state.redo);
  const reset = useMapStore(state => state.reset);
  const clearAll = useMapStore(state => state.clearAll);
  const historyIndex = useMapStore(state => state.historyIndex);
  const history = useMapStore(state => state.history);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleClearAll = () => {
    if (confirm('Delete all objects? This cannot be undone.')) {
      clearAll();
    }
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl p-3 z-10 flex items-center gap-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`p-2 rounded-lg transition-all ${
          canUndo
            ? 'hover:bg-gray-100 text-gray-700'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="Undo"
      >
        <Undo className="w-5 h-5" />
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className={`p-2 rounded-lg transition-all ${
          canRedo
            ? 'hover:bg-gray-100 text-gray-700'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="Redo"
      >
        <Redo className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-gray-300" />

      <button
        onClick={reset}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
        title="Reset View"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      <button
        onClick={handleClearAll}
        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
        title="Clear All Objects"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
