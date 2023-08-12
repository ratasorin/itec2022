import { ReactElement, useCallback, useState } from 'react';
import { Button } from '@mui/material';
import Form from './form/form';
import { useNavigate } from 'react-router';
import { UserDTO } from '@shared';

function SignUpForm(): ReactElement {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const signUp = useCallback(async () => {
    try {
      const user: UserDTO = { name: username, password, email };

      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' },
      }).then(async (r) => await r.json());

      const token: string | undefined = response?.access_token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  }, [username, password, navigate]);

  return (
    <form className="mx-auto flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-2">
        <Form name="username" type="text" set={setUsername} />
        <Form name="email" type="text" set={setEmail} />
        <Form name="password" type="password" set={setPassword} />
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
