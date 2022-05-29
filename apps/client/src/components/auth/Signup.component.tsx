import { ReactElement, useCallback, useState } from 'react';
import { Button } from '@mui/material';
import FormInput from '../chuncks/forminput.component';
import decode from 'jwt-decode';
import { JwtUser } from '@shared';
import { useNavigate } from 'react-router';

function SignUpForm(): ReactElement {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signUp = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name: username, password }),
        headers: [['Content-Type', 'application/json']],
      });
      const { access_token: token } = await response.json();

      console.log({ token });

      const user = decode(token) as JwtUser;
      console.log({ token, user });
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }, [username, password, navigate]);

  return (
    <form className="flex flex-col justify-center mx-auto gap-8">
      <div className="flex flex-col gap-2">
        <FormInput name="username" type="text" set={setUsername} />
        <FormInput name="password" type="password" set={setPassword} />
      </div>

      <div className="flex flex-col">
        <Button variant="outlined" onClick={signUp}>
          Sign Up
        </Button>
      </div>
    </form>
  );
}

export default SignUpForm;
