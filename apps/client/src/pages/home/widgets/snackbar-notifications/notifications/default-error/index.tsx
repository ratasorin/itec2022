import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const DefaultNotificationError = () => {
  return (
    <>
      <div className="mr-2 flex items-center justify-center rounded-full text-red-500">
        <ErrorOutlineIcon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">There was an error on the server</span>
        <span className="mb-2 text-gray-500">
          An unpredictable error occurred, check the logs!
        </span>
      </div>
    </>
  );
};

export default DefaultNotificationError;
