import type { OfficeTimeIntervalDB } from '@shared';
import { useWidgetActions } from '../../../../widgets/hooks/useWidgetActions';
import * as d3 from 'd3';
import { PickerActionBlueprint } from '../../../../widgets/popups/components/Picker/picker.slice';
import { prepareDrawInterval } from './interval';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../hooks/redux/redux.hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { D3BrushEvent } from 'd3';
import { alterBounds } from '../timeline.slice';

const HEIGHT = 150;

const useDrawTimeline = (id: string, brushing: boolean) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: HEIGHT });

  useEffect(() => {
    const width = document.getElementById('timeline-parent')?.clientWidth || 0;
    setDimensions({ width, height: HEIGHT });
  }, []);

  const dispatch = useAppDispatch();
  const { open } = useWidgetActions<PickerActionBlueprint>('picker-popup');

  const { end: chartEndsAt, start: chartStartsAt } = useAppSelector(
    ({ timeline }) => timeline
  ).selectedRange;

  const xScale = useMemo(() => {
    return d3
      .scaleTime()
      .domain([chartStartsAt, chartEndsAt])
      .range([0, dimensions.width]);
  }, [dimensions, chartEndsAt, chartStartsAt]);

  const yScale = useMemo(
    () => d3.scaleLinear().range([dimensions.height, 0]),
    [dimensions]
  );

  const bookedArea = useMemo(
    () =>
      d3
        .area<number>()
        .x((d) => xScale(d))
        .y0(dimensions.height)
        .y1(() => yScale(1))
        .curve(d3.curveStepBefore),
    [dimensions, xScale, yScale]
  );

  const draw = useCallback(
    (intervals: OfficeTimeIntervalDB[]) => {
      d3.select('.timetable').remove();
      const wrapper = d3
        .select('#timeline')
        .append('svg')
        .attr('class', 'timetable')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height + 100)
        .attr('fill', 'red')
        .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);

      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [dimensions.width, dimensions.height],
        ])
        .on('end', (event: D3BrushEvent<unknown>) => {
          if (!event.selection) return;
          const [x1, x2] = event.selection as [number, number];
          const start = xScale.invert(x1);
          const end = xScale.invert(x2);
          dispatch(
            alterBounds({
              interval: { end: end.getTime(), start: start.getTime() },
              update: 'selectedRange',
            })
          );
        });

      wrapper
        .append('g')
        .attr('transform', 'translate(0,' + dimensions.height + ')')
        .call(d3.axisBottom(xScale));

      const container = wrapper.append('g');
      if (brushing) wrapper.append('g').call(brush);

      const drawInterval = prepareDrawInterval({
        area: bookedArea,
        openPopup: open,
        container,
      });

      if (!intervals.length)
        return drawInterval({
          end: new Date(chartEndsAt).toISOString(),
          id,
          name: null,
          start: new Date().toISOString(),
        });

      drawInterval({
        end: new Date(chartEndsAt).toISOString(),
        id,
        name: '-',
        start: new Date().toISOString(),
      });

      return intervals.forEach(
        ({
          booked_from,
          booked_until,
          free_from,
          free_until,
          occupantName,
        }) => {
          drawInterval({
            end: new Date(booked_until).toISOString(),
            id,
            name: occupantName,
            start: new Date(booked_from).toISOString(),
          });
          drawInterval({
            end: new Date(free_until || chartEndsAt).toISOString(),
            id,
            name: null,
            start: new Date(free_from).toISOString(),
          });
        }
      );
    },
    [id, brushing, dimensions, xScale]
  );

  return draw;
};

export default useDrawTimeline;
