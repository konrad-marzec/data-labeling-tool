import { type PointerEvent, type ReactNode, useCallback, useEffect, useRef } from 'react';

interface SVGLayerProps {
  onPointerDown?: (point: DOMPoint) => void;
  onPointerMove?: (point: DOMPoint) => void;
  onPointerUp?: (point: DOMPoint) => void;
  onPointerLeave?: () => void;
  children: ReactNode;
  className?: string;
  viewBox: string;
  height?: number;
  width?: number;
  src: string;
}

function createSVGPoint(svg: SVGSVGElement, x: number, y: number) {
  const ctm = svg.getScreenCTM();

  if (!ctm) {
    return;
  }

  const point = new DOMPoint(x, y);

  return point.matrixTransform(ctm.inverse());
}

function SVGLayer({
  onPointerLeave,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  className,
  children,
  viewBox,
  height,
  width,
  src,
}: SVGLayerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('svg') === svgRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener('touchstart', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('touchend', preventDefault, { passive: false });

    return () => {
      window.removeEventListener('touchstart', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('touchend', preventDefault);
    };
  }, []);

  const _onPointerDown = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      e.stopPropagation();

      if (!svgRef.current || !onPointerDown) {
        return;
      }

      const point = createSVGPoint(svgRef.current, e.clientX, e.clientY);

      if (point) {
        onPointerDown(point);
      }
    },
    [onPointerDown],
  );

  const _onPointerUp = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      e.stopPropagation();

      if (!svgRef.current || !onPointerUp) {
        return;
      }

      const point = createSVGPoint(svgRef.current, e.clientX, e.clientY);

      if (point) {
        onPointerUp(point);
      }
    },
    [onPointerUp],
  );

  const _onPointerMove = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      e.stopPropagation();

      if (!svgRef.current || !onPointerMove) {
        return;
      }

      const point = createSVGPoint(svgRef.current, e.clientX, e.clientY);

      if (point) {
        onPointerMove(point);
      }
    },
    [onPointerMove],
  );

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      onPointerUp={_onPointerUp}
      onPointerMove={_onPointerMove}
      onPointerDown={_onPointerDown}
      onPointerLeave={onPointerLeave}
    >
      <image href={src} />
      {children}
    </svg>
  );
}

export default SVGLayer;
