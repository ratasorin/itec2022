import { useUser } from "../../mock/useUser";

const Admin = () => {
  const user = useUser();
  return user.admin ? true : false;
};

export default Admin;
