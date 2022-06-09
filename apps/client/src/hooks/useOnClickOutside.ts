import { useCallback, useEffect } from 'react';

const useOnClickOutside = <T extends Element | null>(
  ref: T,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  const listener = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!ref) return;
      if (ref && ref.contains(event.target as Node)) return;
      handler(event);
    },
    [ref, handler]
  );

  useEffect(() => {
    setTimeout(() => {
      document.onclick = listener;
    });
  }, [listener]);
};
export default useOnClickOutside;
