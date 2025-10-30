import { useEffect } from 'react';
import { MapView } from './components/MapView';
import { Toolbar } from './components/Toolbar';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { LayerControl } from './components/LayerControl';
import { ObjectEditor } from './components/ObjectEditor';
import { ImportExport } from './components/ImportExport';
import { ControlBar } from './components/ControlBar';
import { useMapStore } from './store/mapStore';

function App() {
  const initializeMockData = useMapStore(state => state.initializeMockData);

  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <MapView />
      <Toolbar />
      <AnalyticsPanel />
      <LayerControl />
      <ImportExport />
      <ObjectEditor />
      <ControlBar />

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-95 rounded-lg shadow-xl px-6 py-3 z-10">
        <h1 className="text-xl font-bold text-gray-800">
          Urban Design Studio - Birmingham, UK
        </h1>
      </div>
    </div>
  );
}

export default App;
