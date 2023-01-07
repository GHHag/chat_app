import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import postData from '../../fetch-utils';

const ChatCreate = () => {
  const [chatSubject, setChatSubject] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);

  const submitNewChatForm = async (event) => {
    event.preventDefault();
    await postData('api/chat/create', { subject: chatSubject });
    setChatSubject("");
  }

  return (
    <>
      <Card className='p-2 m-2'>
        <Row><h3>Create New Chat</h3></Row>
        <Form onSubmit={submitNewChatForm}>
          <Form.Group>
            <Form.Control
              className='my-2'
              type='text'
              value={chatSubject}
              placeholder={'Enter Chat Subject...'}
              onChange={(event) => setChatSubject(event.target.value)}
            />
          </Form.Group>
          <Button type='submit' className='my-2'>Create Chat</Button>
        </Form>
      </Card>
    </>
  )
}

export default ChatCreate;