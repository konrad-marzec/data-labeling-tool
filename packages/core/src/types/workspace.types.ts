import { type LabelType, type PolygonLabel, type RectLabel } from './label.types';

interface LabelNodeBaseProps {
  cursorPosition?: DOMPoint;
  onCancel?: () => void;
  onDelete?: () => void;
  color?: string;
}

type LabelNode<T> = T extends LabelType.POLYGON ? PolygonLabel : T extends LabelType.RECT ? RectLabel : unknown;

export interface LabelNodeProps<T extends LabelType> extends LabelNodeBaseProps {
  onUpdate?: (label?: LabelNode<T>) => void;
  onCreate?: (label: LabelNode<T>) => void;
  onEdit?: (label: LabelNode<T>) => void;
  points?: LabelNode<T>['points'];
  node?: LabelNode<T>;
}

export interface ToolBarProps {
  isDirty?: boolean;
  onClear: () => void;
  onDelete: () => void;
  activeTool?: LabelType;
  isInEditMode?: boolean;
  onToolChange: (type?: LabelType) => void;
}
