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
  /**
   * `render` ensures that the handler's order in the `listeners` array matches the widget's order in the UI.
   *
   * *Context*: widgets have a different rendering strategy: they are mounted on page load, but displayed only when `render` is ***true***.
   *
   * *Problem*: if we push a widget's handler when the widget is mounted, then the order of handlers in the `listeners` array will be
   * the order in which the widgets were instantiated in the code.
   * E.g:
   * ```
   * <>
   *  <WidgetA />
   *  <WidgetB />
   *  <WidgetC />
   * </>
   * ```
   *
   * will lead to
   * ```
   *  [WidgetA-Handler, WidgetB-Handler, WidgetC-Handler]
   * ```
   *
   * even if the widgets were ***rendered*** differently, causing unexpected UI behavior.
   *
   * *Solution*: Use the `render` parameter to account for the rendering strategy of widgets. For regular components use `null`.
   */
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
    // When a widget is rendered add the handler to the `listeners` array
    if (render) add(listener, ref);

    // When a regular component is mounted add the handler to the `listeners` array
    if (render === null) add(listener, ref);

    return () => {
      // cleanup both widgets and regular components
      if (render) remove(ref);
      if (render === null) remove(ref);
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
