import { type RefObject, useEffect } from 'react';

import { useMutableValue } from './use-mutable-value';

function isCloseEnough(time: number, n = 200) {
  return time && Date.now() - time < n;
}

export function useDoubleTap<T, E extends Element>(node: T, element: RefObject<E>, onUpdate?: (label?: T) => void) {
  const nodeRef = useMutableValue(node);

  useEffect(() => {
    if (!onUpdate) {
      return;
    }

    let time: number;
    let cancelTime: number;

    const handleTouch = (e: TouchEvent) => {
      e.stopPropagation();

      if (e.target === element.current) {
        if (isCloseEnough(time)) {
          onUpdate?.(nodeRef.current);
        } else {
          time = Date.now();
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isCloseEnough(cancelTime)) {
          onUpdate?.();
        } else {
          cancelTime = Date.now();
        }
      }
    };

    window.addEventListener('touchend', handleTouch);

    return () => {
      window.removeEventListener('touchend', handleTouch);
    };
  }, [onUpdate, element, nodeRef]);

  useEffect(() => {
    if (!onUpdate) {
      return;
    }

    const handleDBClick = (e: MouseEvent) => {
      if (e.target === element.current) {
        onUpdate?.(nodeRef.current);
      } else {
        onUpdate?.();
      }
    };

    window.addEventListener('dblclick', handleDBClick);

    return () => {
      window.removeEventListener('dblclick', handleDBClick);
    };
  }, [onUpdate, element, nodeRef]);
}
