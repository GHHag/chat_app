import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async (event) => {
    event.preventDefault();
    await fetch(
      `api/user/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            username: username,
            password: password,
          }
        )
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('user session data??', data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <>
      <div className='form-wrapper'>
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
          </Form.Group>
          <Button type='submit' onClick={submitForm}>
            Log in
          </Button>
        </Form>
      </div>
    </>
  );
}

export default LoginForm;