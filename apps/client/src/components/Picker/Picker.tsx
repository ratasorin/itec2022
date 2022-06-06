import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Stack from '@mui/material/Stack';
import { FC, useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import { add } from 'date-fns';
import getUser from '../../utils/user';
import { url } from '../../constants/server';
import { useWidgetActions } from '../../widgets/hooks/useWidgetActions';
import type { Notification } from '../../widgets/components/popup/Notification/notification.slice';
import type { Error } from '@shared';
const Picker: FC<{ id: number }> = ({ id }) => {
  const [bookFrom, setBookFrom] = useState<Date | null>(new Date());
  const [bookUntil, setBookUntil] = useState<Date | null>(
    add(new Date(), { hours: 1 })
  );

  const { open: openNotification } =
    useWidgetActions<Notification>('notification-popup');

  const bookSpace = useCallback(async () => {
    const user = getUser();
    if (!user) return;

    const response = await fetch(url('booking'), {
      method: 'POST',
      body: JSON.stringify({
        book_from: bookFrom,
        book_until: bookUntil,
        space_id: Number(id),
        user_id: Number(user.sub),
      }),
      headers: [['Content-Type', 'application/json']],
    });

    const payload = (await response.json()) as Error | string;
    if (typeof payload === 'string') openNotification({ message: payload });
    else openNotification({ message: payload.message });
  }, [bookFrom, bookUntil, id, openNotification]);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={3}>
          <TimePicker
            ampm={false}
            openTo="hours"
            views={['hours', 'minutes', 'seconds']}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            label={`Book space ${id} from`}
            value={bookFrom}
            onChange={(newDate) => {
              setBookFrom(newDate);
            }}
            renderInput={(params) => <TextField {...params} />}
          />

          <TimePicker
            ampm={false}
            openTo="hours"
            views={['hours', 'minutes', 'seconds']}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            label={`Until`}
            value={bookUntil}
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
