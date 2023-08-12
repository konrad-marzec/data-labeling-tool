import { useCallback, useEffect, useRef, useState } from 'react';

import { useDoubleTap } from '../../../hooks/use-double-tap';
import { useEditKeys } from '../../../hooks/use-edit-keys';
import { type RectLabel } from '../../../types/label.types';
import { updateLabel } from '../../../utils/label.utils';
import { getPolygonFromPair, getPolygonString } from '../../../utils/svg.utils';
import { Polygon } from '../../shapes';
import Handle from '../Handle';

function transformStartEnd(start: DOMPoint, end: DOMPoint): [DOMPoint, DOMPoint] {
  if (start.x < end.x && start.y < end.y) {
    return [DOMPoint.fromPoint(start), DOMPoint.fromPoint(end)];
  }

  if (start.x > end.x && start.y < end.y) {
    return [new DOMPoint(end.x, start.y), new DOMPoint(start.x, end.y)];
  }

  if (start.x > end.x && start.y > end.y) {
    return [DOMPoint.fromPoint(end), DOMPoint.fromPoint(start)];
  }

  return [new DOMPoint(start.x, end.y), new DOMPoint(end.x, start.y)];
}

enum HandleId {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

const CORNERS = [HandleId.TOP_LEFT, HandleId.TOP_RIGHT, HandleId.BOTTOM_RIGHT, HandleId.BOTTOM_LEFT];

interface LabelRectNodeEditProps {
  node: RectLabel;
  onDelete?: () => void;
  cursorPosition?: DOMPoint;
  onEdit?: (label: RectLabel) => void;
  onUpdate?: (label?: RectLabel) => void;
}

function LabelRectNodeEdit({ node, onDelete, onEdit, onUpdate, cursorPosition }: LabelRectNodeEditProps) {
  const shapeRef = useRef<SVGPolygonElement>(null);
  const [activeHandle, setActiveHandle] = useState<HandleId>();

  useEditKeys(node, onUpdate, onDelete);
  useDoubleTap(node, shapeRef, onUpdate);

  useEffect(() => {
    if (!cursorPosition || !onEdit || !activeHandle) {
      return;
    }

    let points: [DOMPoint, DOMPoint] | undefined;

    if (activeHandle === HandleId.TOP_LEFT) {
      points = [cursorPosition, node.points[1]];
    }

    if (activeHandle === HandleId.BOTTOM_RIGHT) {
      points = [node.points[0], cursorPosition];
    }

    if (activeHandle === HandleId.TOP_RIGHT) {
      points = [new DOMPoint(node.points[0].x, cursorPosition.y), new DOMPoint(cursorPosition.x, node.points[1].y)];
    }

    if (activeHandle === HandleId.BOTTOM_LEFT) {
      points = [new DOMPoint(cursorPosition.x, node.points[0].y), new DOMPoint(node.points[1].x, cursorPosition.y)];
    }

    if (points) {
      onEdit(updateLabel(node, { points }));
    }

    // Node gets refreshed every time cursorPosition changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHandle, cursorPosition]);

  const onPointerUp = useCallback(() => {
    if (!onEdit) {
      return;
    }

    setActiveHandle(undefined);
    onEdit(updateLabel(node, { points: transformStartEnd(...node.points) }));
  }, [onEdit, node]);

  const isReadOnly = !onEdit;
  const corners = getPolygonFromPair(...node.points);

  return (
    <>
      <Polygon ref={shapeRef} points={getPolygonString(corners)} />
      {corners.map((point, idx) => (
        <Handle
          onPointerDown={isReadOnly ? undefined : setActiveHandle}
          onPointerUp={isReadOnly ? undefined : onPointerUp}
          nodeId={CORNERS[idx]}
          key={CORNERS[idx]}
          fill={node.color}
          cx={point.x}
          cy={point.y}
        />
      ))}
    </>
  );
}

export default LabelRectNodeEdit;
