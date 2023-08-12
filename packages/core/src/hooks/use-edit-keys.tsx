import { useEffect } from 'react';

import { useMutableValue } from './use-mutable-value';
import { type Label } from '../types/label.types';

export function useEditKeys<T extends Label>(node: T, onUpdate?: (label?: T) => void, onDelete?: () => void) {
  const nodeRef = useMutableValue(node);

  useEffect(() => {
    if (!onUpdate && !onDelete) {
      return;
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onUpdate?.(nodeRef.current);
      }

      if (e.code === 'Escape') {
        onUpdate?.();
      }

      if (e.code === 'Backspace') {
        onDelete?.();
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onUpdate, onDelete, nodeRef]);
}
