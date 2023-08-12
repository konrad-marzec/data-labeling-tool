import { type PointerEvent, type SVGProps, memo, useCallback, useState } from 'react';

interface HandleProps<T> extends Omit<SVGProps<SVGCircleElement>, 'onPointerDown'> {
  onPointerDown?: (nodeId: T, e: PointerEvent<SVGCircleElement>) => void;
  nodeId: T;
}

function Handle<T>({ nodeId, onPointerDown, onPointerUp, ...props }: HandleProps<T>) {
  const [isPointerDown, setIsPointerDown] = useState<boolean>();

  const _onPointerDown = useCallback(
    (e: PointerEvent<SVGCircleElement>) => {
      if (!onPointerDown) {
        return;
      }

      setIsPointerDown(true);
      onPointerDown(nodeId, e);
    },
    [nodeId, onPointerDown],
  );

  const _onPointerUp = useCallback(
    (e: PointerEvent<SVGCircleElement>) => {
      setIsPointerDown(false);
      onPointerUp?.(e);
    },
    [onPointerUp],
  );

  return (
    <circle
      r={8}
      {...props}
      strokeWidth={4}
      onPointerUp={_onPointerUp}
      onPointerDown={_onPointerDown}
      stroke={isPointerDown ? 'white' : 'transparent'}
    />
  );
}

export default memo(Handle) as typeof Handle;
