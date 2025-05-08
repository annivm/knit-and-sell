

import { useRef, useState } from 'react';
import './Authenticate.css';
import Card from '../../shared/components/Card/Card';
import Input from '../../shared/components/Input/Input';
import Button from '../../shared/components/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { loginUser, signUpUser } from '../api/users';
import { useAuthContext } from '../../shared/context/auth-context';

const Authenticate = () => {
    const [isLoginMode, setLoginMode] = useState(true);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const { login } = useAuthContext();

    const [errorMessage, setErrorMessage] = useState("");

    const switchModeHandler = () => {
        setLoginMode(prevMode => !prevMode);
        setErrorMessage("")
    }

    const signUpUserMutation = useMutation({
        mutationFn: signUpUser,
        onSuccess: (data) => {
            login(data.id, data.token)
            setErrorMessage("");
        },
        onError: (error) => {
            setErrorMessage("Failed to signup. " + error);
        }
    })

    const loginUserMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            login(data.id, data.token)
            setErrorMessage("");
        },
        onError: (error) => {
            setErrorMessage("Failed to login. " + error);
        }
    })

    const onSubmitHandler = event => {
        event.preventDefault();
        setErrorMessage("");

        if(isLoginMode && (!emailRef.current.value || !passwordRef.current.value)) {
            setErrorMessage("Email and Password are required fields.");
            return;
        }
        if (!isLoginMode && (!nameRef.current.value || !emailRef.current.value || !passwordRef.current.value)) {
            setErrorMessage("Name, Email, and Password are required fields.");
            return;
        }
        if (isLoginMode) {
            loginUserMutation.mutate({
                email: emailRef.current.value,
                password: passwordRef.current.value
            })
        }
        else {
            signUpUserMutation.mutate({
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value
            })
        }
    }

  return(
    <Card className="authentication">
        <h2>
            {
                !isLoginMode? 'Sign Up' : 'Login'
            }
        </h2>
        <form onSubmit={onSubmitHandler}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {
                !isLoginMode &&
                <Input id="name" ref={nameRef} type="text" label="Name" />
            }
            <Input id="email" ref={emailRef} type="text" label="Email" />
            <Input id="password" ref={passwordRef} type="password" label="Password" />
            <Button type="submit" disabled={signUpUserMutation.isLoading}>
                {
                    isLoginMode? 'LOGIN' : 'SIGNUP'
                }
            </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
            {
                isLoginMode? 'SignUp' : 'Login'
            } instead?
        </Button>
    </Card>
  )
};

export default Authenticate;