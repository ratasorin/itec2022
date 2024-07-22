import { atom, useAtom, useSetAtom } from 'jotai';
import { createPortal } from 'react-dom';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import useHandleClickOutside from '@client/hooks/click-outside';
import { POPUPS_MARGIN, popupStateMachine } from './popups';
import { Box } from '@client/pages/timetable/widgets/picker-popup/picker.slice';
import { TwitterPicker } from 'react-color';
import {
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  Popper,
  TextField,
} from '@mui/material';
import { modifyShapeModalAtom } from '../edit';
import { INITIAL_FILL_COLOR, silverChaliceColorScheme } from '../constants';
import { LuTextCursorInput } from 'react-icons/lu';
import { Tooltip as TooltipMUI } from '@mui/material';
import { LuShapes } from 'react-icons/lu';
import { strokeColorBasedOnFill } from '../utils/draggable-node';
import { FiSave } from 'react-icons/fi';
import * as go from 'gojs';

export const colorAtom = atom<string | null>(INITIAL_FILL_COLOR);
export const nodeKeyAtom = atom<go.Key | null>(null);

const Tooltip: FC<{
  render: boolean;
  box: Box | null;
  nodePath: string | undefined;
}> = ({ render, box, nodePath }) => {
  const [, setPopupState] = useAtom(popupStateMachine);
  const [color, setColor] = useAtom(colorAtom);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );

  const [nodeKey] = useAtom(nodeKeyAtom);

  const [openEditTooltip, setOpenEditTooltip] = useState(false);
  const [officeName, setOfficeName] = useState('');

  const closeDeskTooltip = useCallback(() => {
    setPopupState('IDLE');
    setColor(null);
  }, [setPopupState]);

  const tooltip = useRef<HTMLDivElement | null>(null);
  const [[left, top], setDimensions] = useState<[number | null, number | null]>(
    [null, null]
  );

  useHandleClickOutside('desk-tooltip', closeDeskTooltip, render);
  const setModalOpen = useSetAtom(modifyShapeModalAtom);

  const [openColorPicker, setOpenColorPicker] = useState(false);

  useEffect(() => {
    if (!tooltip.current || !box) return setDimensions([null, null]);
    const dimensions = tooltip.current.getBoundingClientRect();

    const { height: tooltipHeight, width: tooltipWidth } = dimensions;
    const {
      left: leftBox,
      top: topBox,
      width: widthBox,
      height: heightBox,
    } = box;

    let left = leftBox + widthBox / 2 - tooltipWidth / 2;
    let top = topBox - tooltipHeight - POPUPS_MARGIN;

    if (top <= 0 || left <= 0) {
      left = leftBox + widthBox + POPUPS_MARGIN;
      top = topBox + heightBox / 2 - tooltipHeight / 2;
    }
    if (leftBox + widthBox + POPUPS_MARGIN + tooltipWidth > window.innerWidth) {
      left = leftBox - tooltipWidth - POPUPS_MARGIN;
      top = topBox + heightBox / 2 - tooltipHeight / 2;
    }

    setDimensions([left, top]);
  }, [box]);

  useEffect(() => {
    if (openEditTooltip && anchorElement) setOpenEditTooltip(false);
  }, [anchorElement, openEditTooltip]);

  return createPortal(
    <div
      id="desk-tooltip"
      ref={tooltip}
      className="font-poppins absolute z-50 flex flex-row items-center rounded-md border border-slate-300 bg-white p-1 text-lg font-black shadow-md"
      style={{
        visibility: render ? 'visible' : 'hidden',
        top: top || 0,
        left: left || 0,
      }}
    >
      <Popper
        open={!!anchorElement}
        anchorEl={anchorElement}
        placement="bottom"
        className="absolute z-[1000]"
      >
        <ClickAwayListener onClickAway={() => setAnchorElement(null)}>
          <div className="mt-2 flex flex-row items-center rounded-lg border-2 border-slate-300 bg-white py-1 px-2">
            <TextField
              value={officeName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setOfficeName(event.target.value);
              }}
              size="small"
              margin="dense"
              label="Office Name"
            ></TextField>
            <IconButton
              className="ml-2 text-black"
              onClick={() => {
                console.log(officeName);

                const diagram = go.Diagram.fromDiv('board-plan-diagram');
                if (!diagram || !nodeKey) return;
                const node = diagram.findNodeForKey(nodeKey);

                diagram.model.setDataProperty(node?.data, 'name', officeName);
              }}
            >
              <FiSave />
            </IconButton>
          </div>
        </ClickAwayListener>
      </Popper>

      <TooltipMUI
        title="EDIT THE NAME"
        open={openEditTooltip}
        onClose={() => setOpenEditTooltip(false)}
        onOpen={() => setOpenEditTooltip(true)}
      >
        <IconButton
          className="rounded-lg p-2 text-gray-800"
          onClick={(event) => {
            setAnchorElement(event.currentTarget);
          }}
        >
          <LuTextCursorInput />
        </IconButton>
      </TooltipMUI>

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        className="mx-1"
      />

      <TooltipMUI title="CUSTOMIZE SHAPE">
        <IconButton className="rounded-lg p-2 text-gray-800">
          <LuShapes
            onClick={() =>
              setModalOpen({
                render: true,
                color: color || undefined,
                nodePath,
              })
            }
          />
        </IconButton>
      </TooltipMUI>

      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        className="mx-1"
      />

      <ClickAwayListener
        onClickAway={() => {
          setOpenColorPicker(false);
        }}
      >
        <div>
          <TooltipMUI
            PopperProps={{
              disablePortal: true,
            }}
            onClose={() => {
              setOpenColorPicker(false);
            }}
            componentsProps={{
              popper: { className: 'm-0' },
              tooltip: { className: 'm-0 !mt-1 bg-transparent' },
            }}
            open={openColorPicker}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={
              <TwitterPicker
                width="full"
                styles={{
                  default: {
                    hash: { display: 'none' },
                    input: { display: 'none' },
                  },
                }}
                triangle="hide"
                colors={[
                  silverChaliceColorScheme[300],
                  silverChaliceColorScheme[400],
                  silverChaliceColorScheme[500],
                  silverChaliceColorScheme[600],
                ]}
                onChange={(color: any) => {
                  console.log({ hex: color.hex });
                  setColor(color.hex);
                }}
              ></TwitterPicker>
            }
          >
            <Button
              onClick={() => setOpenColorPicker(true)}
              className="font-poppins flex items-center rounded-lg border-black p-2 font-semibold capitalize text-black hover:border-black hover:bg-black/5"
            >
              <span className="mr-2 text-base">Color</span>
              <div
                className="h-6 w-6 rounded-md border-2"
                style={{
                  backgroundColor: color || INITIAL_FILL_COLOR,
                  borderColor: strokeColorBasedOnFill(
                    color || INITIAL_FILL_COLOR
                  ),
                }}
              ></div>
            </Button>
          </TooltipMUI>
        </div>
      </ClickAwayListener>
    </div>,
    document.body
  );
};

export default Tooltip;
