import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const submitForm = (event) => {
    event.preventDefault();
    console.log({ username, password, passwordCheck });
  }

  return (
    <>
      <div className='form-wrapper'>
        <h2>Register User</h2>
        <Form onSubmit={submitForm} autoComplete='on'>
          <Form.Group>
            <Form.Control
              type='text'
              name='username'
              value={username}
              placeholder='Username'
              onChange={(event) => setUsername(event.target.value)}
            />
            <Form.Control
              type='text'
              name='password'
              value={password}
              placeholder='Password'
              onChange={(event) => setPassword(event.target.value)}
            />
            <Form.Control
              type='text'
              name='passwordCheck'
              value={passwordCheck}
              placeholder='Confirm Password'
              onChange={(event) => setPasswordCheck(event.target.value)}
            />
          </Form.Group>
          <Button type='submit' onClick={submitForm}>
            Register
          </Button>
        </Form>
      </div>
    </>
  );
}

export default RegisterForm;