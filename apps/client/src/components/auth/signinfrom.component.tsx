import { ReactElement } from "react";
import { Button, IconButton } from "@mui/material";
import FormInput from "../chuncks/forminput.component";
import GoogleIcon from '@mui/icons-material/Google';

function  SignInForm(): ReactElement {
    return (
        <form className="flex flex-col justify-center mx-auto gap-8">
            <div className="flex flex-col gap-2">
                <FormInput name="email" type="email"/>
                <FormInput name="password" type="password"/>
            </div>

            <div className="flex flex-col">
                <Button variant="outlined">Sign In</Button>
                <IconButton>
                    <GoogleIcon />
                    Log in With Google
                </IconButton>
            </div>
        </form>
    )
}

export default SignInForm;