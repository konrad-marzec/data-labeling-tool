import { useEffect } from 'react';

import { LabelType, type RectLabel } from '../../../types/label.types';
import { createLabel } from '../../../utils/label.utils';
import { getPolygonFromPair, getPolygonString } from '../../../utils/svg.utils';
import { Polygon } from '../../shapes';

interface LabelRectNodeCreateProps {
  color: string;
  cursorPosition?: DOMPoint;
  points: [DOMPoint, DOMPoint];
  onCreate?: (label: RectLabel) => void;
}

function LabelRectNodeCreate({ color, points, onCreate, cursorPosition }: LabelRectNodeCreateProps) {
  useEffect(() => {
    if (!onCreate || points.length < 2) {
      return;
    }

    onCreate(createLabel(points, LabelType.RECT, color));
  }, [onCreate, color, points]);

  if (!cursorPosition) {
    return null;
  }

  return <Polygon color={color} points={getPolygonString(getPolygonFromPair(points[0], cursorPosition))} />;
}

export default LabelRectNodeCreate;
