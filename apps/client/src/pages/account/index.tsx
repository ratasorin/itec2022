import { useUser } from '../../hooks/user';
import LayoutWithNavbar from '../../layouts/with-navbar';
const Index = () => {
  const user = useUser();
  return (
    <LayoutWithNavbar>
      <div>{user?.name}</div>
    </LayoutWithNavbar>
  );
};

export default Index;
