import { useEffect, useRef, useState } from 'react';
import { useNotificationPopup } from './notification.slice';
import ReactDOM from 'react-dom';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Close from '@mui/icons-material/Close';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

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
      style={
        payload.success
          ? {
              color: '#14532d',
              borderColor: '#16a34a',
              backgroundColor: '#f0fdf4',
            }
          : {
              color: '#7f1d1d',
              borderColor: '#dc2626',
              backgroundColor: '#fef2f2',
            }
      }
      className="absolute bottom-10 right-10 flex flex-col rounded-lg border-2 py-3 px-6 font-mono font-medium"
    >
      <div className="mb-1 flex flex-row items-center">
        {payload.message}
        {payload.success ? (
          <DoneIcon className="mx-3" />
        ) : (
          <ErrorOutlineIcon className="mx-3" />
        )}
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={6}
          colors={payload.success ? '#065f46' : '#991b1b'}
          size={30}
          strokeWidth={3}
          onComplete={() => closeNotificationPopup()}
        ></CountdownCircleTimer>
      </div>
      <div className="flex flex-row items-center">
        <button
          className="mr-4 rounded-md py-1 px-3 outline outline-1 hover:bg-black/10"
          onClick={() => setIsPlaying(false)}
        >
          Keep on screen
        </button>
        <button
          className="h-9 w-9 rounded-full hover:bg-black/10"
          onClick={() => closeNotificationPopup()}
        >
          <Close />
        </button>
      </div>
    </div>,
    document.getElementById('snackbar')!
  );
};

export default NotificationPopup;
