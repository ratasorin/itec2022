import { ReactElement, useState } from 'react';
import SignInForm from './login.component';
import SignUpForm from './signup.component';

function AuthForm(): ReactElement {
  const [authType, setAuthType] = useState<'SIGN IN' | 'SIGN UP'>('SIGN UP');

  return (
    <div className="m-auto flex h-max flex-1 flex-col items-center justify-center gap-4">
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
        <SignInForm />
      )}
    </div>
  );
}

export default AuthForm;
