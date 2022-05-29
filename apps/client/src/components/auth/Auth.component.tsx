import { ReactElement, useState } from 'react';
import SignInForm from './Signin.component';
import SignUpForm from './Signup.component';

function AuthForm(): ReactElement {
  const [authType, setAuthType] = useState<'SIGN IN' | 'SIGN UP'>('SIGN UP');

  return (
    <div className="flex flex-col justify-center items-center flex-1 gap-4 h-max m-auto">
      {authType === 'SIGN UP' ? (
        <>
          <SignUpForm />
          <div className="max-w-fit text-xs">
            Do you have an account{' '}
            <p
              className="hover:cursor-pointer hover:underline inline text-cyan-600"
              onClick={() => setAuthType('SIGN IN')}
            >
              Login
            </p>
          </div>
        </>
      ) : (
        <SignInForm />
      )}
    </div>
  );
}

export default AuthForm;
