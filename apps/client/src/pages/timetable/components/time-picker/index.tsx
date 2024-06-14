import getUser from '@client/utils/user';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FC, useCallback, useState } from 'react';
import { add } from 'date-fns';
import { fetchProtectedRoute } from '@client/api/fetch-protected';
import { useNotificationPopup } from '../../widgets/notification-popup/notification.slice';
import { useBookingModal } from '../../widgets/booking-modal/booking.slice';

const HALF_HOUR = 36_000_00 / 2;

const Picker: FC<{ id: string; start: number }> = ({ id, start }) => {
  const [bookFrom, setBookFrom] = useState<Date | null>(
    new Date(HALF_HOUR * Math.floor((start + HALF_HOUR) / HALF_HOUR))
  );
  const [bookUntil, setBookUntil] = useState<Date | null>(
    add(new Date(HALF_HOUR * Math.floor((start + HALF_HOUR) / HALF_HOUR)), {
      hours: 2,
    })
  );

  const openNotification = useNotificationPopup((state) => state.open);
  const closeBookingModal = useBookingModal((state) => state.close);

  const bookOffice = useCallback(async () => {
    const user = getUser();
    if (!user) return;

    closeBookingModal();

    console.log({
      book_from: new Date(bookFrom || 0).toLocaleString(),
      bookUntil: new Date(bookUntil || 0).toLocaleString(),
    });

    try {
      const response = await fetchProtectedRoute('/booking', {
        method: 'POST',
        body: JSON.stringify({
          book_from: bookFrom?.getTime(),
          book_until: bookUntil,
          office_id: id,
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack className="mt-7" spacing={3}>
        <TimePicker
          ampm={false}
          className="text-white"
          openTo="hours"
          views={['hours', 'minutes']}
          inputFormat="HH:mm:ss"
          mask="__:__:__"
          label={`from`}
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
      <Button
        className="row-start-2 mt-7 border-black text-black hover:border-black hover:bg-black/5"
        onClick={bookOffice}
        variant="outlined"
      >
        Book now
      </Button>
    </LocalizationProvider>
  );
};

export default Picker;
