import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { deskRectangleAtom, nodePathAtom } from '../utils/draggable-node';
import Tooltip, { colorAtom } from './tooltip';
import Spinner from './spinner';
import TooltipHover from './tooltip-hover';

export type popupStates =
  | 'IDLE'
  | 'START-COUNTDOWN'
  | 'COUNTDOWN'
  | 'TOOLTIP-START'
  | 'TOOLTIP'
  | 'HOVER-START'
  | 'HOVER';

export type popupSignals =
  | 'NONE'
  | 'MOUSE-UP'
  | 'MOUSE-DOWN'
  | 'HOLD'
  | 'DRAG'
  | 'MOUSE-IN'
  | 'MOUSE-OUT';

export const popupStateMachine = atom<popupStates>('IDLE');
export const popupSignal = atom<popupSignals>('NONE');

let timeout: NodeJS.Timeout | undefined = undefined;

const Popups = () => {
  const [state, setState] = useAtom(popupStateMachine);
  const signal = useAtomValue(popupSignal);
  const nodeBox = useAtomValue(deskRectangleAtom);
  const nodePath = useAtomValue(nodePathAtom);
  const hoverCountdown = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    console.log({ state, signal });

    if (signal === 'DRAG') {
      setState('IDLE');
      clearTimeout(timeout);
    }

    if ((state === 'IDLE' || state === 'HOVER') && signal === 'MOUSE-DOWN')
      setState('START-COUNTDOWN');
    if (state === 'START-COUNTDOWN') {
      if (signal === 'MOUSE-DOWN')
        timeout = setTimeout(() => {
          setState('COUNTDOWN');
        }, 150);
      if (signal === 'MOUSE-UP') {
        setState('IDLE');
        clearTimeout(timeout);
      }
    }
    if (state === 'COUNTDOWN' && signal === 'MOUSE-UP') setState('IDLE');
    if (state === 'COUNTDOWN' && signal === 'HOLD') setState('TOOLTIP-START');
    if (state === 'TOOLTIP-START')
      setTimeout(() => {
        setState('TOOLTIP');
      }, 150);

    if (state === 'IDLE' && signal === 'MOUSE-IN') {
      setState('HOVER-START');
      hoverCountdown.current = setTimeout(() => {
        setState('HOVER');
      }, 150);
    }
    if (
      (state === 'HOVER' || state === 'HOVER-START') &&
      signal === 'MOUSE-OUT'
    ) {
      setState('IDLE');
      clearTimeout(hoverCountdown.current);
    }
  }, [state, signal]);

  return (
    <>
      <TooltipHover box={nodeBox} render={state === 'HOVER'}></TooltipHover>
      <Spinner
        render={state === 'COUNTDOWN' || state === 'TOOLTIP-START'}
        box={nodeBox}
      ></Spinner>
      <Tooltip
        render={state === 'TOOLTIP'}
        box={nodeBox}
        nodePath={nodePath}
      ></Tooltip>
    </>
  );
};

export default Popups;
