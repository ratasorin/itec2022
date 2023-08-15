import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AuthIllustration from '../../assets/auth-illustration.jpg';
import getUser from '../../utils/user';
import SignUpForm from './components/signup';
import LoginForm from './components/login';

function AuthPage(): ReactElement {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user) navigate({ pathname: '/' });
  }, [navigate]);

  const [authType, setAuthType] = useState<'SIGN IN' | 'SIGN UP'>('SIGN UP');

  return (
    <div className="flex w-screen flex-col-reverse md:flex-row">
      <div className="m-auto flex h-screen flex-1 flex-col items-center justify-center gap-4">
        {authType === 'SIGN UP' ? (
          <>
            <SignUpForm />
            <div className="max-w-fit text-xs">
              Do you have an account{' '}
              <p
                className="inline text-cyan-600 hover:cursor-pointer hover:underline"
                onClick={() => setAuthType('SIGN IN')}
              >
                Login
              </p>
            </div>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
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
