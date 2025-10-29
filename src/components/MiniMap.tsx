import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapStore } from '../store/mapStore';
import { BIRMINGHAM_CENTER } from '../types/urbanTypes';

export function MiniMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const center = useMapStore(state => state.center);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles'
          }
        ]
      },
      center: BIRMINGHAM_CENTER,
      zoom: 11,
      interactive: false,
      attributionControl: false
    });

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addSource('viewpoint', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: BIRMINGHAM_CENTER
          }
        }
      });

      map.current.addLayer({
        id: 'viewpoint-circle',
        type: 'circle',
        source: 'viewpoint',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ef4444',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource('viewpoint') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: center
        }
      });
    }
  }, [center]);

  return (
    <div className="absolute top-24 right-4 w-48 h-48 bg-white rounded-lg shadow-xl overflow-hidden border-2 border-gray-200 z-10">
      <div
        ref={mapContainer}
        className="w-full h-full"
      />
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700">
        Overview
      </div>
    </div>
  );
}
