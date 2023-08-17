import { useCallback, useEffect } from 'react';
import { create } from 'zustand';

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
type Listener = (event: MouseEvent | TouchEvent) => boolean;
type Handler = (event: MouseEvent | TouchEvent) => void;

interface ListenerStore {
  add: (listener: Listener, ref: string) => void;
  remove: (ref: string) => void;
  listeners: { handler: Listener; ref: string }[];
}

const useListenerStore = create<ListenerStore>()((set) => ({
  listeners: [],
  add: (listener, ref) => {
    set((state) => ({
      listeners: [...state.listeners, { handler: listener, ref }],
    }));
  },
  remove: (ref) => {
    set((state) => ({
      listeners: [...state.listeners.filter((l) => l.ref !== ref)],
    }));
  },
}));

const useHandleClickOutside = (
  ref: string,
  handler: Handler,
  whitelist: string[] = [],
  render: boolean | null
) => {
  const add = useListenerStore((state) => state.add);
  const listeners = useListenerStore((state) => state.listeners);
  const remove = useListenerStore((state) => state.remove);

  const listener = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const DOMElement = getDOMElement(ref);
      if (!DOMElement) return false;

      if (
        DOMElement.contains(event.target as Node) ||
        isClickInsideWhitelistedElements(event, whitelist)
      )
        return false;

      handler(event);
      return true;
    },
    [handler]
  );

  useEffect(() => {
    if (render) add(listener, ref);

    return () => {
      if (render) remove(ref);
    };
  }, [listener, render]);

  useEffect(() => {
    console.log({ listeners });
  }, [listeners]);

  useEffect(() => {
    const fn = (event: MouseEvent | TouchEvent) => {
      const currentListener = listeners[listeners.length - 1];
      let successfullyHandledClickOutside = false;
      if (currentListener)
        successfullyHandledClickOutside = currentListener.handler(event);
      if (successfullyHandledClickOutside) remove(currentListener.ref);
    };

    setTimeout(() => {
      document.onclick = fn;
    });

    return () => {
      document.onclick = null;
    };
  }, [listeners]);
};
export default useHandleClickOutside;
