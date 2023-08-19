import getUser from '../../../../utils/user';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FC, useCallback, useState } from 'react';
import { add } from 'date-fns';
import { fetchProtected } from 'apps/client/src/api/protected';
import { useNotificationPopup } from '../../widgets/notification-popup/notification.slice';
import { useBookingModal } from '../../widgets/booking-modal/booking.slice';

const Picker: FC<{ id: string; start: number }> = ({ id, start }) => {
  const [bookFrom, setBookFrom] = useState<Date | null>(new Date(start));
  const [bookUntil, setBookUntil] = useState<Date | null>(
    add(new Date(start), { hours: 2 })
  );

  const openNotification = useNotificationPopup((state) => state.open);
  const closeBookingModal = useBookingModal((state) => state.close);

  const bookSpace = useCallback(async () => {
    const user = getUser();
    if (!user) return;

    closeBookingModal();

    try {
      const response = await fetchProtected('booking', {
        method: 'POST',
        body: JSON.stringify({
          book_from: bookFrom?.getTime(),
          book_until: bookUntil,
          space_id: id,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then(async (r) => await r.json());

      const message = response.message as string;
      openNotification({
        message,
        success: true,
      });
    } catch (error) {
      console.error('THERE WAS EN ERROR WITH BOOKING SPACE ' + id, error);
      openNotification({
        message: 'There was an error while trying to book this office',
        success: false,
      });
    }
  }, [bookFrom, bookUntil, id, openNotification]);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={3}>
          <TimePicker
            ampm={false}
            className="text-white"
            openTo="hours"
            views={['hours', 'minutes']}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            label={`Book space ${id} from`}
            value={bookFrom}
            onChange={(newDate) => {
              setBookFrom(newDate);
            }}
            PopperProps={{ id: 'time-picker' }}
            shouldDisableTime={(timeValue, clockType) => {
              if (clockType === 'minutes' && timeValue % 30) {
                return true;
              }

              return false;
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <TimePicker
            ampm={false}
            openTo="hours"
            views={['hours', 'minutes']}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            label={`Until`}
            value={bookUntil}
            shouldDisableTime={(timeValue, clockType) => {
              if (clockType === 'minutes' && timeValue % 30) {
                return true;
              }

              return false;
            }}
            PopperProps={{ id: 'time-picker' }}
            onChange={(newDate) => {
              setBookUntil(newDate);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
        <Button onClick={bookSpace} variant="outlined" className="mt-10">
          Book now
        </Button>
      </LocalizationProvider>
    </div>
  );
};

export default Picker;
