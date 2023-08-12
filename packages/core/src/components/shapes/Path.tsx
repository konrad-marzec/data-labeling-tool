import { type SVGProps, forwardRef } from 'react';

const Path = forwardRef<SVGPathElement, SVGProps<SVGPathElement>>(
  ({ stroke = 'white', fill = 'transparent', ...props }, ref) => (
    <path ref={ref} fill={fill} stroke={stroke} strokeWidth={4} fillOpacity={0.2} strokeDasharray="1 8 1" {...props} />
  ),
);

Path.displayName = 'Path';

export default Path;
