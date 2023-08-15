import { TextField } from '@mui/material';
import { Dispatch, ReactElement, SetStateAction } from 'react';

interface InputProps {
  type: 'text' | 'email' | 'password';
  name: string | undefined;
  set?: Dispatch<SetStateAction<string>>;
}

function Form({ name, type, set }: InputProps): ReactElement {
  return (
    <TextField
      label={name}
      variant="standard"
      type={type}
      onChange={(ev) => {
        if (set) set(ev.target.value);
      }}
    />
  );
}

export default Form;
