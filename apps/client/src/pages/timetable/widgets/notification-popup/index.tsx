import { useEffect, useState } from 'react';
import { useNotificationPopup } from './notification.slice';
import ReactDOM from 'react-dom';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Button } from '@mui/material';

const NotificationPopup = () => {
  const { payload, render } = useNotificationPopup(
    (state) => state.notificationState
  );
  const closeNotificationPopup = useNotificationPopup((state) => state.close);
  const [isPlaying, setIsPlaying] = useState(render);

  useEffect(() => {
    if (render) setIsPlaying(true);

    return () => {
      setIsPlaying(false);
    };
  }, [render]);

  if (!render) return null;
  return ReactDOM.createPortal(
    <div
      onMouseDown={() => {
        setIsPlaying(false);
      }}
      onMouseUp={() => {
        setIsPlaying(true);
      }}
      id="notification-popup"
      className="font-poppins absolute bottom-10 right-10 flex flex-row items-center rounded-lg border-2 border-slate-200 bg-white p-3 font-medium text-slate-800 shadow-lg"
    >
      {payload.success ? (
        <DoneIcon className="mr-4 text-green-600" />
      ) : (
        <ErrorOutlineIcon className="mr-4 text-red-600" />
      )}
      <div className="mr-4 flex flex-col">
        <span className="mr-2">{payload.message}</span>
        <div className="flex flex-row">
          <Button
            className="font-poppins border-black text-black hover:border-black hover:bg-black/5"
            onClick={() => setIsPlaying(false)}
          >
            KEEP
          </Button>
          <Button
            className="font-poppins border-black text-black hover:border-black hover:bg-black/5"
            onClick={() => closeNotificationPopup()}
          >
            DISMISS
          </Button>
        </div>
      </div>
      <CountdownCircleTimer
        isPlaying={isPlaying}
        duration={6}
        colors={payload.success ? '#16a34a' : '#dc2626'}
        size={30}
        strokeWidth={3}
        onComplete={() => closeNotificationPopup()}
      ></CountdownCircleTimer>
    </div>,
    document.getElementById('snackbar')!
  );
};

export default NotificationPopup;
