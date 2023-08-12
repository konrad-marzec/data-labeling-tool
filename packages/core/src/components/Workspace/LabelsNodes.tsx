import { type PointerEvent, memo } from 'react';

import { type Label, LabelType } from '../../types/label.types';
import { getPolygonFromPair, getPolygonString } from '../../utils/svg.utils';
import { Polygon } from '../shapes';

interface LabelsNodesProps {
  nodes: Label[];
  activeNodeId?: string;
  onClick?: (node: Label) => void;
}

function LabelsNodes({ nodes, onClick, activeNodeId }: LabelsNodesProps) {
  return (
    <>
      {nodes.map((label) => {
        const isInEditMode = activeNodeId === label.id;

        if (isInEditMode) {
          return null;
        }

        const onPointerDown = onClick
          ? (e: PointerEvent<SVGPolygonElement>) => {
              e.stopPropagation();
              e.preventDefault();

              onClick(label);
            }
          : undefined;

        if (label.type === LabelType.RECT) {
          return (
            <Polygon
              key={label.id}
              color={label.color}
              onPointerDown={onPointerDown}
              points={getPolygonString(getPolygonFromPair(...label.points))}
            />
          );
        }

        if (label.type === LabelType.POLYGON) {
          return (
            <Polygon
              key={label.id}
              color={label.color}
              onPointerDown={onPointerDown}
              points={getPolygonString(label.points)}
            />
          );
        }

        return null;
      })}
    </>
  );
}

export default memo(LabelsNodes);
