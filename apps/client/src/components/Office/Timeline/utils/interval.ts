import { PickerActionBlueprint } from '../../../../widgets/popups/components/Picker/picker.slice';
import { Selection, Area } from 'd3';

export interface IntervalProps {
  container: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  area: Area<number>;
  xScale: d3.ScaleTime<number, number, never>;
  openPopup: (props: PickerActionBlueprint) => void;
  selectedStart: number;
  selectedEnd: number;
  width: number;
  id: string;
  start: string;
  end: string;
  name: string | null;
}

export const drawInterval = ({
  end,
  id,
  name,
  start,
  area,
  openPopup,
  container,
  xScale,
  selectedEnd,
  selectedStart,
  width: containerWidth,
}: IntervalProps) => {
  return container
    .append('path')
    .attr('d', area([new Date(start).getTime(), new Date(end).getTime()]))
    .attr('fill', name ? 'red' : 'green')
    .on('mouseover', (event: MouseEvent) => {
      let { left, top, height, width } = (
        event.currentTarget as HTMLElement
      ).getBoundingClientRect();

      if (
        selectedStart >= new Date(start).getTime() &&
        selectedEnd <= new Date(end).getTime()
      ) {
        console.log('CASE <>');
        const padding = -xScale(new Date(start)) + left;
        left = padding;
        width = containerWidth;
      } else if (new Date(start).getTime() < selectedStart) {
        console.log('CASE <');
        const padding = -xScale(new Date(start)) + left;
        left = padding;
        width = xScale(new Date(end)) - xScale(new Date(selectedStart));

        console.log(width);
      } else if (new Date(end).getTime() > selectedEnd) {
        console.log('CASE >');
        const padding = -xScale(new Date(start)) + left;
        left = padding;
        width = xScale(new Date(start)) + containerWidth;
      }
      openPopup({
        payload: {
          id,
          interval: {
            end,
            occupantName: name,
            start,
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
};
