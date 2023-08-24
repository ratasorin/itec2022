import { FC, ReactElement } from 'react';
import { useSnackbarNotifications } from '../../snackbar.slice';
import CloseIcon from '@mui/icons-material/Close';

const NotificationBase: FC<{
  notificationId: string;
  children: ReactElement | null;
}> = ({ notificationId, children }) => {
  const closeNotification = useSnackbarNotifications((state) => state.close);

  return (
    <div className="mb-4 max-w-lg rounded-md border-2 border-zinc-200 bg-white p-3 font-mono shadow-md">
      <div className="flex flex-row items-start">
        {children}
        <button
          onClick={() => {
            closeNotification(notificationId);
          }}
          className="ml-4 flex flex-shrink-0 items-center justify-center rounded-full text-gray-500"
        >
          <CloseIcon className="mt-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBase;
