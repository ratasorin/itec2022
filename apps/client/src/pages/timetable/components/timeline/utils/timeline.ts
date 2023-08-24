import type { OfficeTimeIntervalAPI } from '@shared';
import * as d3 from 'd3';
import { drawInterval } from './interval';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { D3BrushEvent } from 'd3';
import { useTimeline } from '../hooks/timeline.slice';
import { usePickerPopup } from '../../../widgets/picker-popup/picker.slice';

const HEIGHT = 150;

const useDrawTimeline = (id: string) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: HEIGHT });

  useEffect(() => {
    const width = document.getElementById('timeline-parent')?.clientWidth || 0;
    setDimensions({ width, height: HEIGHT });
  }, []);

  const { end: selectedEnd, start: selectedStart } = useTimeline(
    (state) => state.timelineState.selectedRange
  );

  const alterBounds = useTimeline((state) => state.alterBounds);
  const openPickerPopup = usePickerPopup((state) => state.open);

  const xScale = useMemo(() => {
    return d3
      .scaleTime()
      .domain([selectedStart, selectedEnd])
      .range([0, dimensions.width]);
  }, [dimensions, selectedEnd, selectedStart]);

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
    (intervals: OfficeTimeIntervalAPI[], brushing: boolean) => {
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

          console.log('SHOULD ALTER BOUNDS');
          alterBounds({
            interval: { end: end.getTime(), start: start.getTime() },
            update: 'selectedRange',
          });
        });

      wrapper
        .append('g')
        .attr('transform', 'translate(0,' + dimensions.height + ')')
        .call(d3.axisBottom(xScale));

      const container = wrapper.append('g');
      if (brushing) wrapper.append('g').call(brush);

      if (!intervals.length)
        return drawInterval({
          area: bookedArea,
          openPickerPopup,
          container,
          xScale,
          selectedEnd,
          selectedStart,
          width: dimensions.width,
          end: selectedEnd,
          id,
          name: null,
          start: new Date().getTime(),
        });

      return intervals.forEach(
        ({
          booked_from,
          booked_until,
          free_from,
          free_until,
          occupantName,
        }) => {
          if (booked_from !== null && booked_until !== null)
            drawInterval({
              area: bookedArea,
              openPickerPopup,
              container,
              xScale,
              selectedEnd,
              selectedStart,
              width: dimensions.width,
              end: new Date(booked_until).getTime(),
              id,
              name: occupantName,
              start: new Date(booked_from).getTime(),
            });
          if (free_from !== null && free_until !== null)
            drawInterval({
              area: bookedArea,
              openPickerPopup,
              container,
              xScale,
              selectedEnd,
              selectedStart,
              width: dimensions.width,
              end:
                free_until !== ''
                  ? new Date(free_until).getTime()
                  : selectedEnd,
              id,
              name: null,
              start: new Date(free_from).getTime(),
            });
        }
      );
    },
    [
      id,
      dimensions,
      xScale,
      selectedEnd,
      selectedStart,
      selectedEnd,
      selectedStart,
    ]
  );

  return draw;
};

export default useDrawTimeline;
