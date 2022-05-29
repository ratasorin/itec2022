import { TextField } from "@mui/material";
import { ReactElement } from "react";

interface InputProps {
    type: "text" | "email" | "password",
    name: string | undefined,
}

function  FormInput(props: InputProps): ReactElement {
    return (
        <TextField label={props.name} variant="standard" type={props.type}/>
    )
}

export default FormInput;