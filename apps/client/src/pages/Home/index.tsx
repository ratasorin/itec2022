import Navbar from '../../components/Navbar';
import Home from '../../components/Home';
const index = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center">
      <Navbar></Navbar>
      <Home />
    </div>
  );
};

export default index;
