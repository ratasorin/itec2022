import CheckIcon from '@mui/icons-material/Check';

const Success = () => {
  return (
    <>
      <div className="mr-2 rounded-full text-green-500">
        <CheckIcon className="h-6 w-6" />
      </div>
      <div className="mr-2 flex flex-col">
        <span className="font-semibold"> Rating successfully modified </span>
        <span className="mb-2 text-gray-500">
          Your rating has been successfully modified! Thank you!
        </span>
        <div className="mb-1 flex flex-row">
          <button
            onClick={() => {}}
            className="mr-3 rounded-md border border-slate-500 py-1 px-2 text-slate-700"
          >
            UNDO
          </button>
          <button className="mr-3 rounded-md border border-red-500 py-1 px-2 text-red-500">
            DELETE
          </button>
        </div>
      </div>
    </>
  );
};

export default Success;
