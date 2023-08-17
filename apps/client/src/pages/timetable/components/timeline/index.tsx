import useDrawTimeline from './utils/timeline';
import AddIcon from '@mui/icons-material/Add';
import useTimetable from './hooks/timetable';
import { FC, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import {
  Button,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import { add, getDate, getDay, getMonth, getYear } from 'date-fns';
import { useTimeline } from './hooks/timeline.slice';
import { DAYS, MONTHS } from 'apps/client/src/constants/dates';

interface TimelineProps {
  id: string;
}

const Timeline: FC<TimelineProps> = ({ id }) => {
  const [brushing, setBrushing] = useState(false);
  const timetable = useTimetable(id);
  const { bounds, selectedRange } = useTimeline((state) => state.timelineState);
  const alterBounds = useTimeline((state) => state.alterBounds);

  const drawTimeline = useDrawTimeline(id);

  useEffect(() => {
    if (Array.isArray(timetable) && drawTimeline)
      drawTimeline(timetable, brushing);
  }, [timetable, selectedRange, brushing]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [valueType, setValueType] = useState('days');
  const [interval, setInterval] = useState([bounds.start, bounds.end]);

  useEffect(() => {
    setInterval([selectedRange.start, selectedRange.end]);
  }, [selectedRange]);

  return (
    <>
      <div
        className="mt-10 flex w-full flex-col items-start justify-center font-mono"
        id="timeline-parent"
      >
        <div className="text-xl">Check the next available hours</div>
        <FormControlLabel
          control={
            <Switch
              onChange={(_, checked) => {
                setBrushing(checked);
              }}
            />
          }
          label={<div className="!font-mono !text-xl">Zoom on timeline</div>}
        />
        <div className="flex w-full flex-row items-center">
          <div>
            <div id="timeline" className="my-10"></div>
            <Slider
              value={interval}
              min={bounds.start}
              max={bounds.end}
              onChange={(_, timestamps) => {
                setInterval(timestamps as number[]);
              }}
              valueLabelFormat={(unixTS: number) => {
                const date = new Date(unixTS);
                const month = MONTHS[getMonth(date)];
                const dayOfTheWeek = DAYS[getDay(date)];
                const year = getYear(date);
                const day = getDate(date);
                return (
                  <div className="flex flex-col items-center">
                    <span>
                      {day} {month} {year} : {dayOfTheWeek}
                    </span>
                    <span>{date.toLocaleTimeString()}</span>
                  </div>
                );
              }}
              onChangeCommitted={(_, timestamps) => {
                if (Array.isArray(timestamps)) {
                  const [startTS, endTS] = timestamps;
                  alterBounds({
                    interval: {
                      start: startTS,
                      end: endTS,
                    },
                    update: 'selectedRange',
                  });
                }
              }}
              valueLabelDisplay="on"
            />
          </div>
          <Tooltip title="Expand timetable" placement="top">
            <IconButton className="ml-10" onClick={() => setOpen(true)}>
              <AddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Modal
            open={open}
            className="flex flex-col items-center justify-center"
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="my-3 flex h-auto w-auto flex-col items-start bg-white p-6 font-mono text-lg">
              <div className="flex w-full flex-row items-center justify-around">
                <div className="flex flex-col items-start">
                  <Button
                    variant="outlined"
                    endIcon={<AddIcon className="mb-[2px]" />}
                    onClick={() => {
                      setValue(0);
                      alterBounds({
                        interval: {
                          end: add(bounds.end, {
                            [valueType]: value,
                          }).getTime(),
                        },
                        update: 'bounds',
                      });
                    }}
                  >
                    Add
                  </Button>
                  <TextField
                    id="standard-basic"
                    variant="standard"
                    required
                    type="number"
                    className="my-3"
                    value={value}
                    onChange={(event) => {
                      setValue(Number(event.currentTarget.value));
                    }}
                  />
                  <FormControl>
                    <RadioGroup
                      className="my-3"
                      row
                      aria-labelledby="radio-group-input-type-selection"
                      defaultValue={valueType}
                      onChange={(event) => {
                        setValueType(event.currentTarget.value);
                      }}
                    >
                      <FormControlLabel
                        value="hours"
                        control={<Radio />}
                        label="hours"
                      />
                      <FormControlLabel
                        value="days"
                        control={<Radio />}
                        label="days"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className="ml-6 flex flex-col">
                  The timetable will show you bookings from
                  <span>{new Date(bounds.start).toLocaleString()}</span>
                  until
                  <span>
                    {add(bounds.end, { [valueType]: value }).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Timeline;
