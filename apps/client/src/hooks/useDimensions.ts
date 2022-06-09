import { useEffect, useMemo, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

const useDimensions = <T extends HTMLElement | null>(element: T) => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  const resizeObserver: ResizeObserver = useMemo(
    () =>
      new ResizeObserver((entries) => {
        console.log({ entries });
        const { width, height } = entries[0].target.getBoundingClientRect();
        setDimensions({ width, height });
      }),
    []
  );

  useEffect(() => {
    if (!element) setDimensions(null);
  }, [element]);

  useEffect(() => {
    if (element) resizeObserver.observe(element);

    return () => {
      if (element) resizeObserver.unobserve(element);
    };
  }, [element, resizeObserver]);

  return dimensions;
};

export default useDimensions;
