import { useState, useEffect, useCallback, useMemo } from 'react';

export const useLocalStorage = (key: string) => {
  const [state, setState] = useState<string | null>(null);
  const localStorageValue = useMemo(() => localStorage.getItem(key), [key]);

  useEffect(() => {
    console.log(localStorageValue);
    if (localStorageValue) {
      setState(localStorageValue);
    }
  }, [localStorageValue]);

  const update = useCallback(
    <T>(updatedValue: T) => {
      setState(JSON.stringify(updatedValue));
      localStorage.setItem(key, JSON.stringify(updatedValue));
    },
    [setState, key]
  );

  const remove = () => {
    setState(null);
    localStorage.removeItem(key);
  };

  return { state, update, remove };
};
