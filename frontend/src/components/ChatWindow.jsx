import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import postFormData from '../../fetch-utils';

const ChatWindow = ({ chatData }) => {
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
      //let messageArray = [...messages, data];
      //setMessages(messageArray);
      //setMessages([...messages, data]);
      setMessages(messages => [...messages, data]);
      //postFormData('api/chat/message', { message: message });
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
    //console.log('ChatWindow - submitMessageForm - message: ', message);
    //setMessages([...messages, message]);
    await postFormData('api/chat/message', { message: message });
    //console.log(event);
  }

  return (
    <>
      <div className='form-wrapper'>
        <div>DUNDERCHATT</div>
        <Card>
          {
            messages && messages.map((message, id) => (
              <Card key={id}>
                <Row ><div>{message.message}</div></Row>
                <Row ><div>{message.timestamp}</div></Row>
              </Card>
            ))
          }
        </Card>
        <Form onSubmit={submitMessageForm} autoComplete='on'>
          <Form.Group>
            <Form.Control
              type='text'
              value={message}
              placeholder={'Type...'}
              onChange={(event) => setMessage(event.target.value)}
            />
          </Form.Group>
          <Button type='submit' onClick={submitMessageForm}>Send</Button>
        </Form>
      </div>
    </>
  )
}

export default ChatWindow;