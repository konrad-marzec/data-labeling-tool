import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

export function useImage(src: string, width?: number, height?: number) {
  const [svgDimensions, setSVGDimensions] = useState<[number, number]>([0, 0]);
  const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      setDimensions([image.width, image.height]);
    };

    image.src = src;
  }, [src]);

  useLayoutEffect(() => {
    const [imgWidth, imgHeight] = dimensions;

    if (!width || !height || !imgWidth || !imgHeight) {
      return;
    }

    const imgRatio = imgWidth / imgHeight;

    if (imgRatio > 1) {
      const w = height * imgRatio;
      if (w >= width) {
        setSVGDimensions([width, width / imgRatio]);
      } else {
        setSVGDimensions([height * imgRatio, height]);
      }
    } else {
      const h = width / imgRatio;
      if (h >= height) {
        setSVGDimensions([height * imgRatio, height]);
      } else {
        setSVGDimensions([width, width / imgRatio]);
      }
    }
  }, [dimensions, height, width]);

  return useMemo(
    () => ({
      width: svgDimensions[0],
      height: svgDimensions[1],
      viewBox: `0 0 ${dimensions[0]} ${dimensions[1]}`,
    }),
    [dimensions, svgDimensions],
  );
}
