import type { OfficeTimeIntervalDB } from '@shared';
import { useWidgetActions } from '../../../../widgets/hooks/useWidgetActions';
import * as d3 from 'd3';
import { add } from 'date-fns';
import { PickerActionBlueprint } from '../../../../widgets/popups/components/Picker/picker.slice';
import { prepareDrawInterval } from './interval';

const useDrawTimeline = (id: string, screenWidth: number) => {
  const dimensions = {
    width: screenWidth - 180,
    height: 150,
  };

  const { open, close } =
    useWidgetActions<PickerActionBlueprint>('picker-popup');

  //set scales
  const chartStartsAt = new Date().getTime();
  const chartEndsAt = add(new Date(), { days: 3 }).getTime();

  const xScale = d3
    .scaleTime()
    .domain([chartStartsAt, chartEndsAt])
    .range([0, dimensions.width]);

  const yScale = d3.scaleLinear().range([dimensions.height, 0]);

  const timeScale = d3
    .scaleTime()
    .domain([chartStartsAt, chartEndsAt])
    .range([0, dimensions.width]);

  d3.select('.timetable').remove();
  const wrapper = d3
    .select('#timeline')
    .append('svg')
    .attr('class', 'timetable')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height + 100)
    .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);

  wrapper
    .append('g')
    .attr('transform', 'translate(0,' + dimensions.height + ')')
    .call(d3.axisBottom(timeScale));

  // prepare data

  const bookedArea = d3
    .area<number>()
    .x((d) => xScale(d))
    .y0(dimensions.height)
    .y1(() => yScale(1))
    .curve(d3.curveStepAfter);

  const drawInterval = prepareDrawInterval({
    closePreviousPopups: close,
    findBookedArea: bookedArea,
    openCurrentPopup: open,
    wrapper,
  });

  return (intervals: OfficeTimeIntervalDB[]) => {
    d3.select('.tooltip').remove();

    if (!intervals.length)
      return drawInterval({
        end: new Date(chartEndsAt).toISOString(),
        id,
        name: null,
        start: new Date().toISOString(),
      });
    return intervals.forEach(
      ({ booked_from, booked_until, free_from, free_until, occupantName }) => {
        drawInterval({
          end: new Date(booked_from).toISOString(),
          id,
          name: occupantName,
          start: new Date(booked_until).toISOString(),
        });

        drawInterval({
          end: new Date(free_from).toISOString(),
          id,
          name: null,
          start: new Date(free_until || chartEndsAt).toISOString(),
        });
      }
    );
  };
};

export default useDrawTimeline;
