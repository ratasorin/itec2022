import { PickerActionBlueprint } from '../../../../widgets/popups/components/Picker/picker.slice';
import { Selection, Area } from 'd3';

interface Dependencies {
  wrapper: Selection<SVGSVGElement, unknown, HTMLElement, any>;
  findBookedArea: Area<number>;
  closePreviousPopups: () => void;
  openCurrentPopup: (props: PickerActionBlueprint) => void;
}

export interface IntervalProps {
  id: string;
  start: string;
  end: string;
  name: string | null;
}

export const prepareDrawInterval =
  ({
    closePreviousPopups,
    findBookedArea,
    openCurrentPopup,
    wrapper,
  }: Dependencies) =>
  ({ end, id, name, start }: IntervalProps) =>
    wrapper
      .append('path')
      .attr(
        'd',
        findBookedArea([new Date(start).getTime(), new Date(end).getTime()])
      )
      .attr('fill', name ? 'red' : 'green')
      .on('mouseover', (event: MouseEvent) => {
        const { left, top, height, width } = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();

        closePreviousPopups();
        setTimeout(() => {
          openCurrentPopup({
            payload: {
              id,
              interval: {
                end,
                occupantName: null,
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
      });
