import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useNavigate } from 'react-router';

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex h-auto w-full flex-row items-center p-6">
      <Button
        variant="outlined"
        endIcon={<AccountCircleIcon />}
        onClick={() => navigate(`/my-account`)}
      >
        My Account
      </Button>
      <Button
        className="mx-6"
        variant="outlined"
        endIcon={<TravelExploreIcon />}
        onClick={() => navigate('/')}
      >
        Find offices
      </Button>
    </div>
  );
};

export default Index;
