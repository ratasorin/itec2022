import { ReactElement, useCallback, useState } from 'react';
import { Button } from '@mui/material';
import FormInput from '../chuncks/forminput.component';
import decode from 'jwt-decode';
import { JwtUser } from '@shared';
import { useNavigate } from 'react-router';

function SignInForm(): ReactElement {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const signIn = useCallback(async () => {
    console.log({ username, password });
    const response = await fetch('http://localhost:3000/auth/login', {
      body: JSON.stringify({ username, password }),
      method: 'POST',
      headers: [['Content-Type', 'application/json']],
    });
    const { access_token: token } = await response.json();
    console.log({ token });
    const user = decode(token) as JwtUser;
    console.log({ token, user });
    localStorage.setItem('token', token);
    navigate('/');
  }, [username, password, navigate]);
  return (
    <form className="flex flex-col justify-center mx-auto gap-8">
      <div className="flex flex-col gap-4">
        <FormInput name="username" type="text" set={setUsername} />
        <FormInput name="password" type="password" set={setPassword} />
      </div>

      <div className="flex flex-col">
        <Button variant="outlined" onClick={signIn}>
          Sign In
        </Button>
      </div>
    </form>
  );
}

export default SignInForm;
