import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from '../store/mapStore';
import { OBJECT_COLORS } from '../types/urbanTypes';
import { objectToGeoJSON } from '../utils/geoUtils';

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Use stable selectors. Each hook only subscribes to one value.
  const objects = useMapStore(state => state.objects);
  const layerVisibility = useMapStore(state => state.layerVisibility);
  const selectedObjectId = useMapStore(state => state.selectedObjectId);
  const center = useMapStore(state => state.center);
  const zoom = useMapStore(state => state.zoom);
  const pitch = useMapStore(state => state.pitch);
  const bearing = useMapStore(state => state.bearing);
  const isAddingObject = useMapStore(state => state.isAddingObject); // Still needed for cursor effect
  // No longer need to directly use pendingObjectType, pendingShapeType, addObject, selectObject, stopAddingObject here
  // as we will get them from useMapStore.getState() inside the click handler.

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
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center,
      zoom,
      pitch,
      bearing,
      maxPitch: 85
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addSource('objects', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      const objectTypes = ['building', 'tree', 'park', 'hospital', 'fire-station', 'water-facility', 'store'];

      objectTypes.forEach(type => {
        map.current?.addLayer({
          id: `${type}-fill`,
          type: 'fill',
          source: 'objects',
          filter: ['==', ['get', 'type'], type],
          paint: {
            'fill-color': OBJECT_COLORS[type as keyof typeof OBJECT_COLORS],
            'fill-opacity': 0.7
          }
        });

        map.current?.addLayer({
          id: `${type}-outline`,
          type: 'line',
          source: 'objects',
          filter: ['==', ['get', 'type'], type],
          paint: {
            'line-color': OBJECT_COLORS[type as keyof typeof OBJECT_COLORS],
            'line-width': 2
          }
        });

        if (type === 'building' || type === 'hospital' || type === 'fire-station' || type === 'store') {
          map.current?.addLayer({
            id: `${type}-extrusion`,
            type: 'fill-extrusion',
            source: 'objects',
            filter: ['==', ['get', 'type'], type],
            paint: {
              'fill-extrusion-color': OBJECT_COLORS[type as keyof typeof OBJECT_COLORS],
              'fill-extrusion-height': ['coalesce', ['get', 'buildingHeight'], 30],
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.8
            }
          });
        }
      });

      map.current.addLayer({
        id: 'selected-outline',
        type: 'line',
        source: 'objects',
        filter: ['==', ['get', 'id'], ''],
        paint: {
          'line-color': '#fbbf24',
          'line-width': 4
        }
      });

      map.current.on('click', (e) => {
        if (!map.current) return;

        // Get the latest state directly from the store to avoid stale closures
        const { isAddingObject, pendingObjectType, pendingShapeType, addObject, stopAddingObject, selectedObjectId, selectObject } = useMapStore.getState();

        if (isAddingObject && pendingObjectType && pendingShapeType) {
          addObject(pendingObjectType, pendingShapeType, e.lngLat.toArray() as [number, number]);
          stopAddingObject();
          return; // Prevent selection immediately after adding
        }

        const features = map.current.queryRenderedFeatures(e.point);
        const objectFeature = features.find(f =>
          f.source === 'objects' && f.properties?.id
        );

        const nextSelectedId = objectFeature ? objectFeature.properties.id : null;
        if (nextSelectedId !== selectedObjectId) {
          selectObject(nextSelectedId);
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []); // Only runs on mount/unmount

  // Effect for cursor style when adding object
  useEffect(() => {
    if (!map.current) return;
    map.current.getCanvas().style.cursor = isAddingObject ? 'crosshair' : '';
  }, [isAddingObject]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource('objects') as maplibregl.GeoJSONSource;
    if (!source) return;

    const features = objects
      .filter(obj => obj.visible && layerVisibility[obj.type])
      .map(obj => objectToGeoJSON(obj));

    source.setData({
      type: 'FeatureCollection',
      features
    });
  }, [objects, layerVisibility]);

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    map.current.setFilter('selected-outline', [
      '==',
      ['get', 'id'],
      selectedObjectId || ''
    ]);
  }, [selectedObjectId]);

  useEffect(() => {
    if (!map.current) return;

    map.current.easeTo({
      center,
      zoom,
      pitch,
      bearing,
      duration: 1000,
      easing: (t) => t * (2 - t)
    });
  }, [center, zoom, pitch, bearing]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
    />
  );
}

