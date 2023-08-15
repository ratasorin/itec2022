import { ReactElement, useCallback, useState } from 'react';
import { Button } from '@mui/material';
import Form from './form';
import { useNavigate } from 'react-router';

function LoginForm(): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const login = useCallback(async () => {
    const response = await fetch('http://localhost:3000/auth/login', {
      body: JSON.stringify({ email, password }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(async (r) => await r.json());

    const token: string | undefined = response?.access_token;
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, [email, password, navigate]);

  return (
    <form className="mx-auto flex flex-col justify-center gap-8">
      <div className="flex flex-col gap-4">
        <Form name="email" type="text" set={setEmail} />
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
