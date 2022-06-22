import { useCallback, useEffect } from 'react';

const getWhitelistedElements = (whitelist: string[]): HTMLElement[] => {
  return whitelist
    .map((id) => document.getElementById(id))
    .filter((element) => element) as HTMLElement[];
};

const getDOMElement = (ref: Element | null | string) => {
  if (typeof ref === 'string') {
    return document.getElementById(ref);
  }

  return ref;
};

const isClickInsideWhitelistedElements = (
  event: MouseEvent | TouchEvent,
  whitelist: string[]
) => {
  const whitelistedElements = getWhitelistedElements(whitelist);
  const target = event.target as HTMLElement;
  return (
    whitelistedElements.reduce(
      (prev, curr) => prev + Number(curr.contains(target)),
      0
    ) > 0
  );
};

const useHandleClickOutside = <T extends Element | null>(
  ref: T | string,
  handler: (event: MouseEvent | TouchEvent) => void,
  whitelist: string[] = []
) => {
  const listener = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const DOMElement = getDOMElement(ref);
      if (!DOMElement) return;

      if (
        DOMElement.contains(event.target as Node) ||
        isClickInsideWhitelistedElements(event, whitelist)
      )
        return;
      handler(event);
    },
    [ref, handler, whitelist]
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
export default useHandleClickOutside;
