import getUser from '../../../utils/user';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { FC, useCallback, useState } from 'react';
import { add } from 'date-fns';
import { url } from '../../../constants/server';
import { useWidgetActions } from '../../../widgets/hooks/useWidgetActions';
import { NotificationActionBlueprint } from '../../../widgets/popups/components/Notification/notification.slice';
import type { Error } from '@shared';

const Picker: FC<{ id: string; start: string }> = ({ id, start }) => {
  const [bookFrom, setBookFrom] = useState<Date | null>(new Date(start));
  const [bookUntil, setBookUntil] = useState<Date | null>(
    add(new Date(start), { hours: 2 })
  );

  const { open: openNotification } =
    useWidgetActions<NotificationActionBlueprint>('notification-popup');

  const bookSpace = useCallback(async () => {
    const user = getUser();
    if (!user) return;
    console.log(user);

    const response = await fetch(url('booking'), {
      method: 'POST',
      body: JSON.stringify({
        book_from: bookFrom,
        book_until: bookUntil,
        space_id: id,
        user_id: user.id,
      }),
      headers: [['Content-Type', 'application/json']],
    });

    const payload: string | Error = await response.json();
    if (typeof payload === 'string')
      openNotification({ payload: { message: payload }, specification: {} });
    else
      openNotification({
        payload: { message: payload.message },
        specification: {},
      });
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
