import type { UserDefinedOfficeTimeInterval } from '@shared';
import { useWidgetActions } from '../../../../widgets/hooks/useWidgetActions';
import * as d3 from 'd3';
import { add } from 'date-fns';
import { PickerActionBlueprint } from '../../../../widgets/popups/components/Picker/picker.slice';

const useDrawTimeline = (id: number) => {
  const { open, close } =
    useWidgetActions<PickerActionBlueprint>('picker-popup');
  return (intervals: UserDefinedOfficeTimeInterval[], screenWidth: number) => {
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

    intervals.forEach(({ end, occupantName, start }) => {
      wrapper
        .append('path')
        .attr(
          'd',
          bookedArea([start.getTime(), end ? end.getTime() : chartEndsAt])
        )
        .attr('fill', occupantName ? 'red' : 'green')
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
                  end: end
                    ? end.toLocaleString()
                    : new Date(chartEndsAt).toLocaleString(),
                  occupantName,
                  start: start.toLocaleString(),
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
    });

    // wrapper.append('path').attr('d', freeArea(intervals)).attr('fill', 'green');
  };
};

export default useDrawTimeline;
