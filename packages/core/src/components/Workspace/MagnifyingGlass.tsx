import { useState, type ReactNode, useCallback } from 'react';

import SVGLayer from './SVGLayer';

interface MagnifyingGlassProps {
  currentPosition?: SVGPoint;
  children?: ReactNode;
  layerHeight: number;
  layerWidth: number;
  zoom?: number;
  src: string;
}

const SIZE = 300;

function MagnifyingGlass({ zoom = 40, src, currentPosition, children, layerHeight, layerWidth }: MagnifyingGlassProps) {
  const [position, setPosition] = useState('-left-4');

  const onPointerEnter = useCallback(() => {
    setPosition((prev) => (prev === '-left-4' ? 'right-4' : '-left-4'));
  }, []);

  const ratio = layerHeight / layerWidth;

  const vertical = zoom;
  const horizontal = zoom * ratio;

  const width = SIZE;
  const height = SIZE * ratio;

  return (
    <div
      className={`absolute -bottom-4 ${position}`}
      onMouseEnter={onPointerEnter}
      style={{
        width,
        height,
      }}
    >
      {currentPosition && (
        <>
          <SVGLayer
            src={src}
            className="ring-4 bg-slate-50 shadow-lg z-10"
            viewBox={`${currentPosition.x - vertical} ${currentPosition.y - horizontal} ${vertical * 2} ${
              horizontal * 2
            }`}
          >
            {children}
          </SVGLayer>
        </>
      )}
    </div>
  );
}

export default MagnifyingGlass;
