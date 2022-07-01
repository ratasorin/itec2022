import { useUser } from '../../hooks/user';
import Layout from '../../layouts/Default';
const Index = () => {
  const user = useUser();
  return <Layout Section={<div>{user?.name}</div>}></Layout>;
};

export default Index;
