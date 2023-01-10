import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const RegisterForm = ({ setUserCallback }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);

  const handlePassword = (e) => {
    setPassword(e.target.value);
    validatePassword(e);
  }

  const validatePassword = (e) => {
    //const validPassword = /^(?=.*[!@#$%^&*"])(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}/
    const validPassword = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,}/;
    console.log(e.target.value);
    console.log(e.target.value.match(validPassword));
    if (e.target?.value && e.target.value.match(validPassword)) {
      setPasswordValid(true);
      setPassword(e.target.value);
    }
    else {
      setPasswordValid(false);
      setPassword(e.target.value);
    }
  }

  const handlePasswordConfirmed = (e) => {
    setPasswordConfirm(e.target.value);
    validatePasswordConfirmed(e);
  }

  const validatePasswordConfirmed = (e) => {
    if (password === e.target.value) {
      setPasswordConfirmed(true);
    }
    else {
      setPasswordConfirmed(false);
    }
  }

  const submitForm = async (event) => {
    event.preventDefault();
    await fetch(
      'api/user/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password, userRole: 'user' })
      }
    )
      .then((res) => res.json())
      .then((data) => setUserCallback(data.user))
      .catch((err) => console.log(err.message));
    setUsername("");
    setPassword("");
    setPasswordConfirm("");
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
              type='password'
              name='password'
              value={password}
              placeholder='Password...'
              style={!passwordValid && password.length > 0 ? { 'borderColor': 'red', 'borderWidth': '3px' } : { 'borderColor': 'lightGrey' }}
              //onChange={(event) => setPassword(event.target.value)}
              onChange={(e) => handlePassword(e)}
            />
            <Form.Control
              className='my-2'
              type='password'
              name='passwordCheck'
              value={passwordConfirm}
              placeholder='Confirm Password...'
              //onChange={(event) => setPasswordConfirm(event.target.value)}
              style={!passwordConfirmed && passwordConfirm.length > 0 ? { 'borderColor': 'red', 'borderWidth': '3px' } : { 'borderColor': 'lightGrey' }}
              onChange={(event) => handlePasswordConfirmed(event)}
            />
          </Form.Group>
          <Button type='submit' disabled={!passwordValid && passwordConfirmed ? true : false} className='my-2'>Register</Button>
        </Form>
      </Card>
    </>
  );
}

export default RegisterForm;