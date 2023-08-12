import { type SVGProps, forwardRef } from 'react';

const Polygon = forwardRef<SVGPolygonElement, SVGProps<SVGPolygonElement>>(({ color = 'white', ...props }, ref) => (
  <polygon ref={ref} fill={color} stroke={color} strokeWidth={4} fillOpacity={0.2} strokeDasharray="1 8 1" {...props} />
));

Polygon.displayName = 'Polygon';

export default Polygon;
