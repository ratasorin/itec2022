import { ReactElement } from "react";
import { Button } from "@mui/material";
import FormInput from "../chuncks/forminput.component";

function  SignInForm(): ReactElement {

    return (
        <form className="flex flex-col justify-center mx-auto gap-8">
            <div className="flex flex-col gap-4">
                <FormInput name="email" type="email"/>
                <FormInput name="password" type="password"/>
            </div>

            <div className="flex flex-col">
                <Button variant="outlined">Sign In</Button>
            </div>
        </form>
    )
}

export default SignInForm;