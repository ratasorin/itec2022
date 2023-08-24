import { Area } from 'd3';
import { PickerPopupPayload } from '../../../widgets/picker-popup/picker.slice';

export interface IntervalProps {
  container: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  area: Area<number>;
  xScale: d3.ScaleTime<number, number, never>;
  openPickerPopup: (payload: PickerPopupPayload) => void;
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
  openPickerPopup,
  container,
  xScale,
  selectedEnd,
  selectedStart,
  width: containerWidth,
}: IntervalProps) => {
  return container
    .append('path')
    .attr('d', area([start, end]))
    .attr('fill', name ? '#ef4444' : '#22c55e')
    .on('mouseover', (event: MouseEvent) => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

      let left = rect.left,
        width = rect.right;
      const { top, height } = rect;

      if (selectedStart >= start && selectedEnd <= end) {
        const padding = -xScale(new Date(start)) + rect.left;
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
      openPickerPopup({
        id,
        interval: {
          end,
          occupantName: name,
          start,
        },
        box: {
          height,
          width,
          left,
          top,
        },
      });
    });
};
