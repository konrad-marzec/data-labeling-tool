export function getPolygonFromPair(start: DOMPoint, end: DOMPoint) {
  return [
    DOMPoint.fromPoint(start),
    new DOMPoint(end.x, start.y),
    DOMPoint.fromPoint(end),
    new DOMPoint(start.x, end.y),
  ];
}

export function getPolygonString(points: DOMPoint[]): string {
  return points.reduce((res, point) => `${res} ${point.x},${point.y}`, '');
}

export function getPathString(points: DOMPoint[]) {
  if (points.length < 1) {
    return '';
  }

  return points.reduce(
    (res, point) => `${res} L ${point.x} ${point.y} L ${point.x} ${point.y}`,
    `M ${points[0].x} ${points[0].y}`,
  );
}
