import type { OfficeTimeIntervalDB } from '@shared';
import { useWidgetActions } from '../../../../widgets/hooks/useWidgetActions';
import * as d3 from 'd3';
import { add } from 'date-fns';
import { PickerActionBlueprint } from '../../../../widgets/popups/components/Picker/picker.slice';

const useDrawTimeline = (id: number) => {
  const { open, close } =
    useWidgetActions<PickerActionBlueprint>('picker-popup');
  return (intervals: OfficeTimeIntervalDB[], screenWidth: number) => {
    const dimensions = {
      width: screenWidth - 180,
      height: 150,
    };

    //draw canvas
    d3.select('.timetable').remove();
    d3.select('.tooltip').remove();
    const wrapper = d3
      .select('#timeline')
      .append('svg')
      .attr('class', 'timetable')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height + 100)
      .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
    //set scales
    const chartStartsAt = new Date().getTime();
    const chartEndsAt = add(new Date(), { days: 1 }).getTime();

    const xScale = d3
      .scaleTime()
      .domain([chartStartsAt, chartEndsAt])
      .range([0, dimensions.width]);

    const yScale = d3.scaleLinear().range([dimensions.height, 0]);

    // prepare data

    const bookedArea = d3
      .area<number>()
      .x((d) => xScale(d))
      .y0(dimensions.height)
      .y1(() => yScale(1))
      .curve(d3.curveStepAfter);

    const timeScale = d3
      .scaleTime()
      .domain([chartStartsAt, chartEndsAt])
      .range([0, dimensions.width]);

    wrapper
      .append('g')
      .attr('transform', 'translate(0,' + dimensions.height + ')')
      .call(d3.axisBottom(timeScale));

    intervals.forEach(
      ({ booked_from, booked_until, free_from, free_until, occupantName }) => {
        wrapper
          .append('path')
          .attr(
            'd',
            bookedArea([
              new Date(booked_from).getTime(),
              new Date(booked_until).getTime(),
            ])
          )
          .attr('fill', 'red')
          .on('mouseover', (event: MouseEvent) => {
            const { left, top, height, width } = (
              event.currentTarget as HTMLElement
            ).getBoundingClientRect();
            close();
            setTimeout(() => {
              open({
                payload: {
                  id,
                  interval: {
                    end: new Date(booked_until).toLocaleString(),
                    occupantName,
                    start: new Date(booked_from).toLocaleString(),
                  },
                },
                specification: {
                  box: {
                    height,
                    width,
                    left,
                    top,
                  },
                },
              });
            });
          });
        wrapper
          .append('path')
          .attr(
            'd',
            bookedArea([
              new Date(free_from).getTime(),
              new Date(free_until || new Date(chartEndsAt)).getTime(),
            ])
          )
          .attr('fill', 'green')
          .on('mouseover', (event: MouseEvent) => {
            const { left, top, height, width } = (
              event.currentTarget as HTMLElement
            ).getBoundingClientRect();
            close();
            setTimeout(() => {
              open({
                payload: {
                  id,
                  interval: {
                    end: new Date(free_from).toLocaleString(),
                    occupantName: null,
                    start: new Date(
                      free_until || new Date(chartEndsAt)
                    ).toLocaleString(),
                  },
                },
                specification: {
                  box: {
                    height,
                    width,
                    left,
                    top,
                  },
                },
              });
            });
          });
      }
    );

    // wrapper.append('path').attr('d', freeArea(intervals)).attr('fill', 'green');
  };
};

export default useDrawTimeline;
