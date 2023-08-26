import { FC } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const UnidentifiedError: FC<{ details: string }> = ({ details }) => {
  return (
    <>
      <div className="mr-2 flex items-center justify-center rounded-full text-red-500">
        <ErrorOutlineIcon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">There was an error on the server</span>
        <span className="mb-2 text-gray-500">{details}</span>
      </div>
    </>
  );
};

export default UnidentifiedError;
