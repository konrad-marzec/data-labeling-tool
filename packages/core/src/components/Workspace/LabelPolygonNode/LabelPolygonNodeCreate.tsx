import { type PointerEvent, useCallback, useEffect } from 'react';

import { LabelType, type PolygonLabel } from '../../../types/label.types';
import { createLabel } from '../../../utils/label.utils';
import { getPathString } from '../../../utils/svg.utils';
import { Path } from '../../shapes';

interface LabelPolygonNodeCreateProps {
  color: string;
  points: DOMPoint[];
  onCancel?: () => void;
  cursorPosition?: DOMPoint;
  onCreate?: (label: PolygonLabel) => void;
}

function LabelPolygonNodeCreate({ color, points, onCreate, onCancel, cursorPosition }: LabelPolygonNodeCreateProps) {
  useEffect(() => {
    if (!onCreate && !onCancel) {
      return;
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onCancel?.();
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onCancel, onCreate, color, points]);

  const _onCreate = useCallback(
    (e: PointerEvent<SVGCircleElement>) => {
      e.stopPropagation();

      onCreate?.(createLabel(points, LabelType.POLYGON, color));
    },
    [color, onCreate, points],
  );

  return (
    <>
      <Path stroke={color} d={getPathString(cursorPosition ? [...points, cursorPosition] : points)} />
      {Boolean(onCreate) && (
        <circle
          r={10}
          stroke={color}
          strokeWidth={2}
          cx={points[0].x}
          cy={points[0].y}
          fill="transparent"
          onPointerUp={_onCreate}
        />
      )}
    </>
  );
}

export default LabelPolygonNodeCreate;
