import { UrbanObject, BoxObject, CircleObject, PolygonObject, Analytics } from '../types/urbanTypes';

export function calculateArea(obj: UrbanObject): number {
  switch (obj.shape) {
    case 'box': {
      const box = obj as BoxObject;
      return box.width * box.height;
    }
    case 'circle': {
      const circle = obj as CircleObject;
      return Math.PI * circle.radius * circle.radius;
    }
    case 'polygon': {
      const polygon = obj as PolygonObject;
      if (polygon.points.length < 3) return 0;
      let area = 0;
      for (let i = 0; i < polygon.points.length; i++) {
        const j = (i + 1) % polygon.points.length;
        area += polygon.points[i][0] * polygon.points[j][1];
        area -= polygon.points[j][0] * polygon.points[i][1];
      }
      return Math.abs(area / 2);
    }
    default:
      return 0;
  }
}

export function calculateAnalytics(objects: UrbanObject[]): Analytics {
  let totalArea = 0;
  let greenArea = 0;
  let waterArea = 0;

  objects.forEach(obj => {
    if (!obj.visible) return;

    const area = calculateArea(obj);
    totalArea += area;

    if (obj.type === 'tree' || obj.type === 'park') {
      greenArea += area;
    }
    if (obj.type === 'water-facility') {
      waterArea += area;
    }
  });

  const greenPercentage = totalArea > 0 ? (greenArea / totalArea) * 100 : 0;
  const waterPercentage = totalArea > 0 ? (waterArea / totalArea) * 100 : 0;
  const combinedPercentage = greenPercentage + waterPercentage;
  const compliant = combinedPercentage >= 15;

  return {
    totalObjects: objects.length,
    totalArea,
    greenArea,
    waterArea,
    greenPercentage,
    waterPercentage,
    compliant
  };
}

export function createBoxCoordinates(
  center: [number, number],
  width: number,
  height: number,
  rotation: number = 0
): [number, number][] {
  const [lng, lat] = center;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const corners: [number, number][] = [
    [lng - halfWidth, lat - halfHeight],
    [lng + halfWidth, lat - halfHeight],
    [lng + halfWidth, lat + halfHeight],
    [lng - halfWidth, lat + halfHeight]
  ];

  if (rotation !== 0) {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return corners.map(([x, y]) => {
      const dx = x - lng;
      const dy = y - lat;
      return [
        lng + dx * cos - dy * sin,
        lat + dx * sin + dy * cos
      ];
    });
  }

  return corners;
}

export function createCircleCoordinates(
  center: [number, number],
  radius: number,
  segments: number = 32
): [number, number][] {
  const [lng, lat] = center;
  const coords: [number, number][] = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    coords.push([
      lng + radius * Math.cos(angle),
      lat + radius * Math.sin(angle)
    ]);
  }

  return coords;
}

export function objectToGeoJSON(obj: UrbanObject): GeoJSON.Feature {
  let geometry: GeoJSON.Geometry;

  switch (obj.shape) {
    case 'box': {
      const box = obj as BoxObject;
      const coords = createBoxCoordinates(
        obj.coordinates,
        box.width,
        box.height,
        box.rotation || 0
      );
      coords.push(coords[0]);
      geometry = {
        type: 'Polygon',
        coordinates: [coords]
      };
      break;
    }
    case 'circle': {
      const circle = obj as CircleObject;
      const coords = createCircleCoordinates(obj.coordinates, circle.radius);
      coords.push(coords[0]);
      geometry = {
        type: 'Polygon',
        coordinates: [coords]
      };
      break;
    }
    case 'polygon': {
      const polygon = obj as PolygonObject;
      const coords = [...polygon.points];
      coords.push(coords[0]);
      geometry = {
        type: 'Polygon',
        coordinates: [coords]
      };
      break;
    }
  }

  return {
    type: 'Feature',
    properties: {
      id: obj.id,
      type: obj.type,
      shape: obj.shape,
      name: obj.name,
      visible: obj.visible,
      created: obj.created,
      ...(obj.shape === 'box' && {
        width: (obj as BoxObject).width,
        height: (obj as BoxObject).height,
        rotation: (obj as BoxObject).rotation,
        buildingHeight: (obj as BoxObject).buildingHeight
      }),
      ...(obj.shape === 'circle' && {
        radius: (obj as CircleObject).radius
      }),
      ...(obj.shape === 'polygon' && {
        buildingHeight: (obj as PolygonObject).buildingHeight
      })
    },
    geometry
  };
}

export function objectsToGeoJSON(objects: UrbanObject[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: objects.map(objectToGeoJSON)
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function offsetCoordinate(coord: [number, number], offsetMeters: number = 100): [number, number] {
  const metersToLng = offsetMeters / 111320;
  const metersToLat = offsetMeters / 110540;
  return [
    coord[0] + metersToLng * (Math.random() - 0.5),
    coord[1] + metersToLat * (Math.random() - 0.5)
  ];
}
