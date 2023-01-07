import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import postData from '../../fetch-utils';

const RegisterForm = ({ setUserCallback }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const submitForm = async (event) => {
    event.preventDefault();
    //postData(
    await fetch(
      'api/user/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password, userRole: 'user' })
      }
      //{ username: username, password: password, userRole: 'user' }
    )
      .then((res) => res.json())
      .then((data) => setUserCallback(data.user))
      .catch((err) => console.log(err.message));
    setUsername("");
    setPassword("");
    setPasswordCheck("");
  }

  return (
    <>
      <Card className='p-2 m-2'>
        <Row><h2>Register User</h2></Row>
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
            <Form.Control
              className='my-2'
              type='text'
              name='passwordCheck'
              value={passwordCheck}
              placeholder='Confirm Password...'
              onChange={(event) => setPasswordCheck(event.target.value)}
            />
          </Form.Group>
          <Button type='submit' className='my-2'>Register</Button>
        </Form>
      </Card>
    </>
  );
}

export default RegisterForm;