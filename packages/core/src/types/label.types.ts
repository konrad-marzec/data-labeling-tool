export enum LabelType {
  RECT = 'rect',
  POLYGON = 'polygon',
}

interface LabelBase {
  id: string;
  color: string;
}

export interface RectLabel extends LabelBase {
  points: [DOMPoint, DOMPoint];
  type: LabelType.RECT;
}

export interface PolygonLabel extends LabelBase {
  points: DOMPoint[];
  type: LabelType.POLYGON;
}

export type Label = RectLabel | PolygonLabel;
