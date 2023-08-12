import { v4 as uuidv4 } from 'uuid';

import { type Label, type LabelType, type PolygonLabel, type RectLabel } from '../types/label.types';

export function createLabel(points: [DOMPoint, DOMPoint], type: LabelType.RECT, color: string): RectLabel;
export function createLabel(points: DOMPoint[], type: LabelType.POLYGON, color: string): PolygonLabel;
export function createLabel(points: [DOMPoint, DOMPoint] | DOMPoint[], type: LabelType, color: string): unknown {
  return {
    id: uuidv4(),
    points,
    color,
    type,
  };
}

export function updateLabel(label: PolygonLabel, changeset: Omit<Partial<PolygonLabel>, 'id'>): PolygonLabel;
export function updateLabel(label: RectLabel, changeset: Omit<Partial<RectLabel>, 'id'>): RectLabel;
export function updateLabel(label: Label, changeset: Omit<Partial<Label>, 'id'>): unknown {
  return {
    ...label,
    ...changeset,
  };
}
