import { ReactElement, useCallback, useState } from 'react';
import { Button } from '@mui/material';
import Form from './form/form';
import { useNavigate } from 'react-router';

function LoginForm(): ReactElement {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useCallback(async () => {
    const response = await fetch('http://localhost:3000/auth/login', {
      body: JSON.stringify({ username, password }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const token: string | undefined = (await response.json())?.access_token;
    console.log({ token });
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, [username, password, navigate]);
  return (
    <form className="mx-auto flex flex-col justify-center gap-8">
      <div className="flex flex-col gap-4">
        <Form name="username" type="text" set={setUsername} />
        <Form name="password" type="password" set={setPassword} />
      </div>

      <div className="flex flex-col">
        <Button variant="outlined" onClick={login}>
          Login
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
