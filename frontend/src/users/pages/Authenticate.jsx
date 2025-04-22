

import { useRef, useState } from 'react';
import './Authenticate.css';
import Card from '../../shared/components/Card/Card';
import Input from '../../shared/components/Input/Input';
import Button from '../../shared/components/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { loginUser, signUpUser } from '../../items/api/users';
import { useAuthContext } from '../../shared/context/auth-context';

const Authenticate = () => {
    const [isLoginMode, setLoginMode] = useState(true);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const { login } = useAuthContext();

    const switchModeHandler = () => {
        setLoginMode(prevMode => !prevMode);
    }

    const signUpUserMutation = useMutation({
        mutationFn: signUpUser,
        onSuccess: (data) => {
            login(data.id, data.token)
        },
        onError: (error) => {
            console.error(error);
        }
    })

    const loginUserMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            login(data.id, data.token)
        },
        onError: (error) => {
            console.log(error);
        }
    })

    const onSubmitHandler = event => {
        event.preventDefault();

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
            {
                !isLoginMode &&
                <Input id="name" ref={nameRef} type="text" label="Name" />
            }
            <Input id="email" ref={emailRef} type="text" label="Email" />
            <Input id="password" ref={passwordRef} type="password" label="Password" />
            <Button type="submit" disable={signUpUserMutation.isLoading}>
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