import Button from '@mui/material/Button';

const index = () => {
  return (
      <Button
        variant="outlined"
        endIcon={<AccountCircleIcon />}
        onClick={() => navigate(`/my-account`)}
      >
        My Account
      </Button>
    </div>
  );
};

export default index;
