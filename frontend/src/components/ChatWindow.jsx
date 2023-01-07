import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import postData from '../../fetch-utils';

const ChatWindow = ({ chatData, setSelectedChatCallback }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  //console.log('messageHistory: ', messageHistory);
  //console.log('ChatWindow chatData: ', chatData);

  const startSSE = () => {
    let sse = new EventSource('/api/sse');

    sse.addEventListener('connect', message => {
      let data = JSON.parse(message.data);
      console.log('[connect]', data);
    });

    sse.addEventListener('disconnect', message => {
      let data = JSON.parse(message.data);
      console.log('[disconnect]', data);
    });

    sse.addEventListener('new-message', message => {
      let data = JSON.parse(message.data);
      console.log('[new-message]', data);
      setMessages(messages => [...messages, data]);
      //setMessages([...messages, data]);
    });
  }

  useEffect(() => {
    startSSE()
  }, []);

  const getChatMessages = async (chatId) => {
    //console.log(chatId);
    /* const getChatMessagesResponse = await fetch(
      `/api/chat/message/${chatId}`
    );
    const chatMessagesJson = await getChatMessagesResponse.result.json();
    setSelectedChatMessages(chatMessagesJson); */
  }

  const submitMessageForm = async (event) => {
    event.preventDefault();
    await postData('api/chat/message', { message: message });
    setMessage("");
  }

  return (
    <>
      <Card className='p-2 m-2'>
        <Row className='my-2'>
          <Col sm={10} className=''>
            <h3>{chatData.chat_subject}</h3>
          </Col>
          <Col>
            <Button onClick={() => { fetch('api/chat/disconnect', { method: 'POST' }); setSelectedChatCallback(false); }}>
              Close Chat
            </Button>
          </Col>
        </Row>
        <div className='my-2'>Messages</div>
        {
          messages && messages.map((message, id) => (
            <Card key={id} className='my-2 bg-secondary'>
              <Row className='my-1 px-2'><Col>{new Date(message.timestamp).toISOString()}</Col></Row>
              <Row className='my-1 px-2'><Col>{message.message}</Col></Row>
            </Card>
          ))
        }
        <Form onSubmit={submitMessageForm} autoComplete='on'>
          <Form.Group>
            <Form.Control
              className='my-2'
              type='text'
              value={message}
              placeholder={'Type...'}
              onChange={(event) => setMessage(event.target.value)}
            />
          </Form.Group>
          <Button type='submit'>Send</Button>
        </Form>
      </Card>
    </>
  )
}

export default ChatWindow;