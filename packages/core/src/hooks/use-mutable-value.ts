import { useLayoutEffect, useRef } from 'react';

export function useMutableValue<T>(value: T) {
  const valueRef = useRef<T>(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}
