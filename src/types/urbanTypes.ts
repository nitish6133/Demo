export type ObjectType = 'building' | 'tree' | 'park' | 'hospital' | 'fire-station' | 'water-facility' | 'store';

export type ShapeType = 'box' | 'circle' | 'polygon';

export interface BaseUrbanObject {
  id: string;
  type: ObjectType;
  shape: ShapeType;
  name: string;
  coordinates: [number, number];
  visible: boolean;
  created: number;
}

export interface BoxObject extends BaseUrbanObject {
  shape: 'box';
  width: number;
  height: number;
  rotation?: number;
  buildingHeight?: number;
}

export interface CircleObject extends BaseUrbanObject {
  shape: 'circle';
  radius: number;
}

export interface PolygonObject extends BaseUrbanObject {
  shape: 'polygon';
  points: [number, number][];
  buildingHeight?: number;
}

export type UrbanObject = BoxObject | CircleObject | PolygonObject;

export interface MapState {
  objects: UrbanObject[];
  selectedObjectId: string | null;
  history: UrbanObject[][];
  historyIndex: number;
  layerVisibility: Record<ObjectType, boolean>;
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  isAddingObject: boolean; // New state for adding mode
  pendingObjectType: ObjectType | null; // New state for pending object type
  pendingShapeType: ShapeType | null; // New state for pending shape type
}

export interface Analytics {
  totalObjects: number;
  totalArea: number;
  greenArea: number;
  waterArea: number;
  greenPercentage: number;
  waterPercentage: number;
  compliant: boolean;
}

export const OBJECT_COLORS: Record<ObjectType, string> = {
  building: '#94a3b8',
  tree: '#22c55e',
  park: '#16a34a',
  hospital: '#ef4444',
  'fire-station': '#f97316',
  'water-facility': '#3b82f6',
  store: '#a855f7'
};

export const OBJECT_ICONS: Record<ObjectType, string> = {
  building: '🏢',
  tree: '🌳',
  park: '🌲',
  hospital: '🏥',
  'fire-station': '🚒',
  'water-facility': '💧',
  store: '🏪'
};

export const BIRMINGHAM_CENTER: [number, number] = [-1.8904, 52.4862];
