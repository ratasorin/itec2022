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
  start: number;
  end: number;
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
    .attr('d', area([start, end]))
    .attr('fill', name ? 'red' : 'green')
    .on('mouseover', (event: MouseEvent) => {
      let { left, top, height, width } = (
        event.currentTarget as HTMLElement
      ).getBoundingClientRect();

      if (selectedStart >= start && selectedEnd <= end) {
        const padding = -xScale(new Date(start)) + left;
        left = padding;
        width = containerWidth;
      } else if (start < selectedStart) {
        const padding = -xScale(new Date(start)) + left;
        left = padding;
        width = xScale(new Date(end)) - xScale(new Date(selectedStart));
      } else if (end > selectedEnd) {
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
