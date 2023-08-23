import { useSnackbarNotifications } from '../../snackbar.slice';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const DefaultNotificationError: React.FC<{ notificationId: string }> = ({
  notificationId,
}) => {
  const closeNotification = useSnackbarNotifications((state) => state.close);

  return (
    <div className="mb-4 rounded-md border-2 border-zinc-200 bg-white p-3 font-mono shadow-md">
      <div className="flex flex-row items-start">
        <>
          <div className="mr-2 flex items-center justify-center rounded-full text-red-500">
            <ErrorOutlineIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">
              There was an error on the server
            </span>
            <span className="mb-2 text-gray-500">
              An unpredictable error occurred, check the logs!
            </span>
          </div>
        </>
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

export default DefaultNotificationError;
