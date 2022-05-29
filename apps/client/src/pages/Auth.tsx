import { ReactElement, useEffect } from 'react';
import AuthForm from '../components/auth/Auth.component';
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
    <div className="flex md:flex-row flex-col-reverse w-screen">
      <AuthForm />
      <div className="flex-1 grid place-items-center">
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
