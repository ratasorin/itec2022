import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Rating } from '@mui/material';
import { FC, useState } from 'react';
import { RatingAddedPayload } from '../../snackbar.slice';
import { useSnackbarNotifications } from '../../snackbar.slice';

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

const DuplicateReviewError = () => {
  const [stars, setStars] = useState(0);
  const [update, setUpdate] = useState(false);
  return (
    <>
      <div className="mr-2 rounded-full text-red-500">
        <ErrorOutlineIcon className="h-6 w-6" />
      </div>
      <div className="mr-2 flex flex-col">
        <span className="font-semibold">
          {' '}
          You've already submitted a rating!{' '}
        </span>
        <span className="mb-2 max-w-sm text-gray-500">
          <div>
            You cannot submit two ratings, but you can
            <br />
            <em>delete</em> or
            <em> update</em> the current one.
          </div>
          {update && (
            <div className="flex flex-row items-center justify-around">
              <div>
                <div className="mt-2">Updated rating:</div>
                <Rating
                  onChange={(event, stars) => {
                    setStars(stars || 0);
                  }}
                />
              </div>
              <Button
                variant="outlined"
                className=" border-gray-500 font-mono text-black hover:border-gray-700 hover:bg-black/10"
              >
                SUBMIT
              </Button>
            </div>
          )}
        </span>
        <div className="mb-1 flex flex-row">
          <button
            onClick={() => setUpdate(!update)}
            className="mr-3 rounded-md border border-slate-500 py-1 px-2 text-slate-700"
          >
            {update ? 'CANCEL' : 'UPDATE'}
          </button>
          <button className="mr-3 rounded-md border border-red-500 py-1 px-2 text-red-500">
            FORCE DELETE
          </button>
        </div>
      </div>
    </>
  );
};

const Success = () => {
  const [stars, setStars] = useState(0);
  const [update, setUpdate] = useState(false);
  return (
    <>
      <div className="mr-2 rounded-full text-green-500">
        <CheckIcon className="h-6 w-6" />
      </div>
      <div className="mr-2 flex flex-col">
        <span className="font-semibold"> Rating successfully added </span>
        <span className="mb-2 text-gray-500">
          Your rating has been successfully uploaded! Thank you!
        </span>
        {update && (
          <span>
            Updated rating:{' '}
            <Rating
              onChange={(event, stars) => {
                setStars(stars || 0);
              }}
            />
          </span>
        )}
        <div className="mb-1 flex flex-row">
          <button
            onClick={() => {
              if (!update) setUpdate(true);
            }}
            className="mr-3 rounded-md bg-pink-500 py-1 px-2 text-white"
          >
            {update ? 'SAVE' : 'UPDATE'}
          </button>
          <button className="mr-3 rounded-md border border-red-500 py-1 px-2 text-red-500">
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

const RatingAdded: React.FC<
  RatingAddedPayload & { notificationId: string }
> = ({ details, notificationId }) => {
  const closeNotification = useSnackbarNotifications((state) => state.close);

  return (
    <div className="mb-4 rounded-md border-2 border-zinc-200 bg-white p-3 font-mono shadow-md">
      <div className="flex flex-row items-start">
        {details.success ? (
          <Success />
        ) : details.error.cause === 'UNIQUE REVIEWER CONSTRAINT FAILED' ? (
          <DuplicateReviewError />
        ) : (
          <UnidentifiedError details={details.error.details} />
        )}
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

export default RatingAdded;
