import { type UIEvent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function getDistanceBetween(a: DOMPoint, b: DOMPoint) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

export function stopPropagation<T extends UIEvent>(e: T) {
  e.stopPropagation();
}

export function preventDefault<T extends UIEvent>(e: T) {
  e.preventDefault();
}
