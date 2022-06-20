import { useCallback, useEffect } from 'react';

const useOnClickOutside = <T extends Element | null>(
  ref: T | string,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  const listener = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (typeof ref === 'string') {
        const DOMElement = document.querySelector(`#${ref}`) as T;
        if (DOMElement && DOMElement.contains(event.target as Node)) return;
        return handler(event);
      }

      if (ref && ref.contains(event.target as Node)) return;
      handler(event);
    },
    [ref, handler]
  );

  useEffect(() => {
    setTimeout(() => {
      if (ref !== null) document.onclick = listener;
    });

    return () => {
      document.onclick = null;
    };
  }, [listener, ref]);
};
export default useOnClickOutside;
