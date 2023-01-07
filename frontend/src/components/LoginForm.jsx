import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import postData from '../../fetch-utils';

const LoginForm = ({ setUserCallback }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async (event) => {
    event.preventDefault();
    const response = await postData('api/user/login', { username: username, password: password });
    const responseJson = await response.json();
    await setUserCallback(responseJson.user);
    setUsername("");
    setPassword("");
  }

  return (
    <>
      <Card className='p-2 m-2'>
        <Row><h2>Log in</h2></Row>
        <Form onSubmit={submitForm} autoComplete='on'>
          <Form.Group>
            <Form.Control
              className='my-2'
              type='text'
              name='username'
              value={username}
              placeholder='Username...'
              onChange={(event) => setUsername(event.target.value)}
            />
            <Form.Control
              className='my-2'
              type='text'
              name='password'
              value={password}
              placeholder='Password...'
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <Button type='submit' className='my-2'>Log in</Button>
        </Form>
      </Card>
    </>
  );
}

export default LoginForm;