import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { deskRectangleAtom } from '../utils/draggable-node';
import Tooltip from './tooltip';
import Spinner from './spinner';

export type popupStates =
  | 'IDLE'
  | 'START-COUNTDOWN'
  | 'COUNTDOWN'
  | 'TOOLTIP-START'
  | 'TOOLTIP';
export type popupSignals = 'NONE' | 'MOUSE-UP' | 'MOUSE-DOWN' | 'HOLD' | 'DRAG';

export const popupStateMachine = atom<popupStates>('IDLE');
export const popupSignal = atom<popupSignals>('NONE');

let timeout: NodeJS.Timeout | undefined = undefined;

const Popups = () => {
  const [state, setState] = useAtom(popupStateMachine);
  const signal = useAtomValue(popupSignal);
  const nodeBox = useAtomValue(deskRectangleAtom);

  useEffect(() => {
    console.log({ state, signal });

    if (signal === 'DRAG') {
      setState('IDLE');
      clearTimeout(timeout);
    }

    if (state === 'IDLE' && signal === 'MOUSE-DOWN')
      setState('START-COUNTDOWN');
    if (state === 'START-COUNTDOWN')
      timeout = setTimeout(() => {
        setState('COUNTDOWN');
      }, 150);
    if (state === 'COUNTDOWN' && signal === 'MOUSE-UP') setState('IDLE');
    if (state === 'COUNTDOWN' && signal === 'HOLD') setState('TOOLTIP-START');
    if (state === 'TOOLTIP-START')
      setTimeout(() => {
        setState('TOOLTIP');
      }, 150);
  }, [state, signal]);

  return (
    <>
      <Spinner
        render={state === 'COUNTDOWN' || state === 'TOOLTIP-START'}
        box={nodeBox}
      ></Spinner>
      <Tooltip render={state === 'TOOLTIP'} box={nodeBox}></Tooltip>
    </>
  );
};

export default Popups;
