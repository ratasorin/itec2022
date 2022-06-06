import type { Interval } from '@shared';
import { useWidgetActions } from '../../../widgets/hooks/useWidgetActions';
import * as d3 from 'd3';
import { add } from 'date-fns';
import { Details } from '../../../widgets/components/popup/Details/details.slice';

type Time = {
  time: number;
  name: string | null;
};

const useDrawTimeline = (ID: number) => {
  const { close, open } = useWidgetActions<Details>('details-popup');
  return (intervals: Interval[], screenWidth: number) => {
    //set dimensions
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
      .area<Time>()
      .x((d) => xScale(d.time))
      .y0(dimensions.height)
      .y1(() => yScale(1))
      .curve(d3.curveStepAfter);
    // prepare tooltip
    const div = d3
      .select('#timeline')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0.7)
      .style('visibility', 'hidden');

    const timeScale = d3
      .scaleTime()
      .domain([chartStartsAt, chartEndsAt])
      .range([0, dimensions.width]);

    wrapper
      .append('g')
      .attr('transform', 'translate(0,' + dimensions.height + ')')
      .call(d3.axisBottom(timeScale));

    intervals.forEach(({ end, name, start }, index) => {
      wrapper
        .append('path')
        .attr(
          'd',
          bookedArea([
            { name, time: new Date(start).getTime() },
            { name, time: new Date(end || chartEndsAt).getTime() },
          ])
        )
        .attr('fill', name ? 'red' : 'green')
        .on('mousemove', (event) => {
          div
            .html(
              `The space is ${name ? 'booked' : 'free'} from <br/>` +
                new Date(start).toLocaleString() +
                `<br/> until </br />` +
                new Date(end || chartEndsAt).toLocaleString()
            )
            .style('visibility', 'visible')
            .style('top', event.pageY - 60 + 'px')
            .style('left', event.pageX - 60 + 'px');
        })
        .on('mouseout', () => {
          div.transition();
          div.style('visibility', 'hidden');
        });
    });

    // wrapper.append('path').attr('d', freeArea(intervals)).attr('fill', 'green');
  };
};

export default useDrawTimeline;
