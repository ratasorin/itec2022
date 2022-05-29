import { ReactElement, useEffect } from "react";
import AuthForm from "../components/auth/authform.component";

import AuthIllustration from '../assets/photo/auth-illustration.jpg';
import { useUser } from "../mock/useUser";
import { useNavigate } from "react-router";

function AuthPage(): ReactElement {

    useEffect(() => {
        function RedirectIfUserExists(): void {
            // const user = useUser();
            // const navigate = useNavigate();
            
            // if(user != null) {
            //     if(user.admin === true) {
            //         navigate('/admin');
            //     } else {
            //         navigate('/search');
            //     }
            // }
        }

        RedirectIfUserExists();
    }, []);

    return (
        <div className="flex md:flex-row flex-col-reverse w-screen">
            <AuthForm />
            <div className="flex-1 grid place-items-center">
                <img 
                    className="w-2/3 sm:w-2/3 md:w-3/5"
                    src={AuthIllustration} 
                    alt="Authentication Illustration" 
                />
            </div>
        </div>
    )
}

export default AuthPage;