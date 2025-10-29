import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UrbanObject, MapState, BIRMINGHAM_CENTER, ObjectType, ShapeType } from '../types/urbanTypes';
import { generateId, offsetCoordinate } from '../utils/geoUtils';

interface MapStore extends MapState {
  addObject: (type: ObjectType, shape: ShapeType, coordinates: [number, number]) => void;
  updateObject: (id: string, updates: Partial<UrbanObject>) => void;
  deleteObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  toggleLayerVisibility: (type: ObjectType) => void;
  setViewState: (center: [number, number], zoom: number, pitch: number, bearing: number) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  importData: (objects: UrbanObject[]) => void;
  clearAll: () => void;
  initializeMockData: () => void;
  startAddingObject: (type: ObjectType, shape: ShapeType) => void;
  stopAddingObject: () => void;
}

const createInitialState = (): MapState => ({
  objects: [],
  selectedObjectId: null,
  history: [[]],
  historyIndex: 0,
  layerVisibility: {
    building: true,
    tree: true,
    park: true,
    hospital: true,
    'fire-station': true,
    'water-facility': true,
    store: true
  },
  center: BIRMINGHAM_CENTER,
  zoom: 14,
  pitch: 60,
  bearing: -15,
  isAddingObject: false,
  pendingObjectType: null,
  pendingShapeType: null,
});

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      addObject: (type, shape, coordinates) => {
        const state = get();
        let newObject: UrbanObject;

        const baseObject = {
          id: generateId(),
          type,
          shape,
          name: `${type}-${state.objects.length + 1}`,
          coordinates: coordinates, // Use provided coordinates
          visible: true,
          created: Date.now()
        };

        switch (shape) {
          case 'box':
            newObject = {
              ...baseObject,
              shape: 'box',
              width: type === 'building' ? 0.0005 : 0.001,
              height: type === 'building' ? 0.0003 : 0.0008,
              rotation: 0,
              buildingHeight: type === 'building' ? 50 : undefined
            };
            break;
          case 'circle':
            newObject = {
              ...baseObject,
              shape: 'circle',
              radius: type === 'tree' ? 0.0002 : 0.0008
            };
            break;
          case 'polygon':
            newObject = {
              ...baseObject,
              shape: 'polygon',
              points: [
                [coordinates[0], coordinates[1] + 0.0005],
                [coordinates[0] + 0.0005, coordinates[1] - 0.0005],
                [coordinates[0] - 0.0005, coordinates[1] - 0.0005]
              ],
              buildingHeight: type === 'building' ? 40 : undefined
            };
            break;
        }

        const newObjects = [...state.objects, newObject];
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newObjects);

        set({
          objects: newObjects,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedObjectId: newObject.id
        });
      },

      updateObject: (id, updates) => {
        const state = get();
        const newObjects = state.objects.map(obj =>
          obj.id === id ? { ...obj, ...updates } as UrbanObject : obj
        );

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newObjects);

        set({
          objects: newObjects,
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },

      deleteObject: (id) => {
        const state = get();
        const newObjects = state.objects.filter(obj => obj.id !== id);

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newObjects);

        set({
          objects: newObjects,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
        });
      },

      selectObject: (id) => {
        set({ selectedObjectId: id });
      },

      toggleLayerVisibility: (type) => {
        const state = get();
        set({
          layerVisibility: {
            ...state.layerVisibility,
            [type]: !state.layerVisibility[type]
          }
        });
      },

      setViewState: (center, zoom, pitch, bearing) => {
        set({ center, zoom, pitch, bearing });
      },

      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          set({
            objects: state.history[newIndex],
            historyIndex: newIndex,
            selectedObjectId: null // Deselect on undo/redo to avoid stale selection
          });
        }
      },

      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          set({
            objects: state.history[newIndex],
            historyIndex: newIndex,
            selectedObjectId: null // Deselect on undo/redo to avoid stale selection
          });
        }
      },

      reset: () => {
        set({
          center: BIRMINGHAM_CENTER,
          zoom: 14,
          pitch: 60,
          bearing: -15
        });
      },

      importData: (objects) => {
        const state = get();
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(objects);

        set({
          objects,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedObjectId: null
        });
      },

      clearAll: () => {
        const newHistory = [[]];
        set({
          objects: [],
          history: newHistory,
          historyIndex: 0,
          selectedObjectId: null
        });
      },

      initializeMockData: () => {
        const state = get();
        if (state.objects.length > 0) return;

        const mockObjects: UrbanObject[] = [
          {
            id: generateId(),
            type: 'park',
            shape: 'box',
            name: 'Central Park',
            coordinates: offsetCoordinate(BIRMINGHAM_CENTER, 200),
            width: 0.002,
            height: 0.0015,
            rotation: 0,
            visible: true,
            created: Date.now()
          },
          {
            id: generateId(),
            type: 'building',
            shape: 'box',
            name: 'Office Tower',
            coordinates: offsetCoordinate(BIRMINGHAM_CENTER, 300),
            width: 0.0004,
            height: 0.0003,
            rotation: 0,
            buildingHeight: 80,
            visible: true,
            created: Date.now()
          },
          {
            id: generateId(),
            type: 'hospital',
            shape: 'box',
            name: 'Birmingham Hospital',
            coordinates: offsetCoordinate(BIRMINGHAM_CENTER, 250),
            width: 0.0008,
            height: 0.0006,
            rotation: 0,
            buildingHeight: 40,
            visible: true,
            created: Date.now()
          },
          {
            id: generateId(),
            type: 'tree',
            shape: 'circle',
            name: 'Oak Tree',
            coordinates: offsetCoordinate(BIRMINGHAM_CENTER, 150),
            radius: 0.0001,
            visible: true,
            created: Date.now()
          },
          {
            id: generateId(),
            type: 'tree',
            shape: 'circle',
            name: 'Maple Tree',
            coordinates: offsetCoordinate(BIRMINGHAM_CENTER, 180),
            radius: 0.00012,
            visible: true,
            created: Date.now()
          },
          {
            id: generateId(),
            type: 'water-facility',
            shape: 'circle',
            name: 'Water Reservoir',
            coordinates: offsetCoordinate(BIRMINGHAM_CENTER, 400),
            radius: 0.0006,
            visible: true,
            created: Date.now()
          },
          {
            id: generateId(),
            type: 'fire-station',
            shape: 'box',
            name: 'Fire Station Alpha',
            coordinates: offsetCoordinate(BIRMINGHAM_CENTER, 350),
            width: 0.0005,
            height: 0.0004,
            rotation: 0,
            buildingHeight: 25,
            visible: true,
            created: Date.now()
          },
          {
            id: generateId(),
            type: 'store',
            shape: 'box',
            name: 'Shopping Center',
            coordinates: offsetCoordinate(BIRMINGHAM_CENTER, 280),
            width: 0.001,
            height: 0.0007,
            rotation: 0,
            buildingHeight: 15,
            visible: true,
            created: Date.now()
          }
        ];

        set({
          objects: mockObjects,
          history: [mockObjects],
          historyIndex: 0
        });
      },

      startAddingObject: (type, shape) => {
        set({
          isAddingObject: true,
          pendingObjectType: type,
          pendingShapeType: shape,
          selectedObjectId: null // Deselect any object when starting to add
        });
      },

      stopAddingObject: () => {
        set({
          isAddingObject: false,
          pendingObjectType: null,
          pendingShapeType: null
        });
      }
    }),
    {
      name: 'urban-design-storage',
      partialize: (state) => ({
        objects: state.objects,
        layerVisibility: state.layerVisibility,
        center: state.center,
        zoom: state.zoom,
        pitch: state.pitch,
        bearing: state.bearing
      })
    }
  )
);
