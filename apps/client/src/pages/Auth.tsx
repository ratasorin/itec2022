import { ReactElement, useEffect } from 'react';
import AuthForm from '../components/Auth/Auth.component';
import { useNavigate } from 'react-router';
import AuthIllustration from '../assets/photo/auth-illustration.jpg';
import getUser from '../utils/user';

function AuthPage(): ReactElement {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user) navigate({ pathname: '/' });
  }, [navigate]);

  return (
    <div className="flex w-screen flex-col-reverse md:flex-row">
      <AuthForm />
      <div className="grid flex-1 place-items-center">
        <img
          className="w-2/3 sm:w-1/2 md:w-1/3"
          src={AuthIllustration}
          alt="Authentication Illustration"
        />
      </div>
    </div>
  );
}

export default AuthPage;
