import randomColor from 'randomcolor';
import { type ComponentType, useEffect, useMemo, useState } from 'react';

import Empty from '../components/ui/Empty';
import LabelPolygonNode from '../components/Workspace/LabelPolygonNode/LabelPolygonNode';
import LabelRectNode from '../components/Workspace/LabelRectNode/LabelRectNode';
import { LabelType } from '../types/label.types';
import { type LabelNodeProps } from '../types/workspace.types';
import { getDistanceBetween, noop } from '../utils/misc.utils';

type WorkspaceEvents = {
  onMouseDown: (point: DOMPoint) => void;
  onMouseUp: (point: DOMPoint) => void;
  reset: () => void;
};

type WorkspaceData<T> = { points?: T; color?: string };

export function useWorkspaceEvents(
  type?: LabelType,
): [ComponentType<LabelNodeProps<LabelType>>, WorkspaceData<DOMPoint[]>, WorkspaceEvents] {
  const [color, setColor] = useState<string>();
  const [points, setPoints] = useState<DOMPoint[]>();

  useEffect(() => {
    setColor(undefined);
    setPoints(undefined);
  }, [type]);

  const events = useMemo(() => {
    const reset = () => {
      setColor(undefined);
      setPoints(undefined);
    };

    if (type === LabelType.RECT) {
      const onMouseDown = (point: DOMPoint) => {
        setPoints([point]);
        setColor(randomColor({ luminosity: 'bright' }));
      };

      const onMouseUp = (point: DOMPoint) => {
        setPoints((prev) => {
          if (prev && getDistanceBetween(prev[0], point) > 5) {
            return [...(prev ? prev : []), point];
          }

          return undefined;
        });
      };

      return { onMouseDown, onMouseUp, reset };
    }

    if (type === LabelType.POLYGON) {
      const onMouseUp = (point: DOMPoint) => {
        setColor((prev) => prev ?? randomColor({ luminosity: 'bright' }));
        setPoints((prev) => [...(prev ? prev : []), point]);
      };

      return { onMouseDown: noop, onMouseUp, reset };
    }

    return { onMouseDown: noop, onMouseUp: noop, reset };
  }, [type]);

  return useMemo(() => {
    if (type === LabelType.RECT) {
      return [LabelRectNode, { points, color }, events];
    }

    if (type === LabelType.POLYGON) {
      return [LabelPolygonNode, { points, color }, events];
    }

    return [Empty, { points, color }, events];
  }, [color, events, points, type]);
}
