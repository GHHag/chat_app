import React from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = ({ setUserCallback }) => {
    return (
        <>
            <LoginForm setUserCallback={setUserCallback}></LoginForm>
            <RegisterForm></RegisterForm>
        </>
    )
}

export default Login;