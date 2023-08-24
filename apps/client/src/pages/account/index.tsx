import { useUser } from '@client/hooks/user';
import LayoutWithNavbar from '@client/layouts/with-navbar';
const Index = () => {
  const user = useUser();
  return (
    <LayoutWithNavbar>
      <div>{user?.name}</div>
    </LayoutWithNavbar>
  );
};

export default Index;
