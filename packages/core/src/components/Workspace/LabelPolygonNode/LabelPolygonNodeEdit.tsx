import { useCallback, useEffect, useRef, useState } from 'react';

import { useDoubleTap } from '../../../hooks/use-double-tap';
import { useEditKeys } from '../../../hooks/use-edit-keys';
import { type PolygonLabel } from '../../../types/label.types';
import { updateLabel } from '../../../utils/label.utils';
import { getPolygonString } from '../../../utils/svg.utils';
import { Polygon } from '../../shapes';
import Handle from '../Handle';

interface LabelRectNodeEditProps {
  node: PolygonLabel;
  onDelete?: () => void;
  cursorPosition?: DOMPoint;
  onEdit?: (label: PolygonLabel) => void;
  onUpdate?: (label?: PolygonLabel) => void;
}

function LabelPolygonNodeEdit({ node, cursorPosition, onUpdate, onDelete, onEdit }: LabelRectNodeEditProps) {
  const [activeHandle, setActiveHandle] = useState<number>();
  const shapeRef = useRef<SVGPolygonElement>(null);

  useEditKeys(node, onUpdate, onDelete);
  useDoubleTap(node, shapeRef, onUpdate);

  useEffect(() => {
    if (!cursorPosition || !onEdit || activeHandle === undefined) {
      return;
    }

    const points = [...node.points];
    points[activeHandle] = cursorPosition;

    onEdit(updateLabel(node, { points }));
    // Node gets refreshed every time cursorPosition changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHandle, cursorPosition, onEdit]);

  const onPointerUp = useCallback(() => {
    if (!onEdit) {
      return;
    }

    setActiveHandle(undefined);
  }, [onEdit]);

  const isReadOnly = !onEdit;

  return (
    <>
      <Polygon ref={shapeRef} points={getPolygonString(node.points)} />
      {node.points.map((point, idx) => (
        <Handle
          onPointerDown={isReadOnly ? undefined : setActiveHandle}
          onPointerUp={isReadOnly ? undefined : onPointerUp}
          fill={node.color}
          cx={point.x}
          cy={point.y}
          nodeId={idx}
          key={idx}
        />
      ))}
    </>
  );
}

export default LabelPolygonNodeEdit;
