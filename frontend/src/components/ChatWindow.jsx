import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ChatWindow = ({ chatData, userData, setSelectedChatCallback }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [enableChatInviting, setEnableChatInviting] = useState(false);
  const [enableChatModerating, setEnableChatModerating] = useState(false);
  const [userList, setUserList] = useState([]);

  const startSSE = () => {
    let sse = new EventSource(`/api/sse?chatId=${chatData.chat_id}`);

    sse.addEventListener('connect', message => {
      let data = JSON.parse(message.data);
      data.chatData = chatData;
      console.log('[connect]', data);
    });

    sse.addEventListener('disconnect', message => {
      let data = JSON.parse(message.data);
      console.log('[disconnect]', data);
      sse.close();
    });

    sse.addEventListener('new-message', message => {
      let data = JSON.parse(message.data);
      data.chatData = chatData;
      console.log('[new message]', data);
      setMessages([...messages, data])
      //setMessages(messages.concat([data]));
      //setMessages(messages => [...messages, data]);
    });
  }

  useEffect(() => {
    startSSE()
    //}, [messages]);
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
    //await postData('api/chat/message', { content: message, fromId: userData.id });
    await fetch(
      'api/chat/message',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: chatData.chat_id,
          content: message,
          from: userData.username,
          fromId: userData.id
        })
      }
    )
      .then(setMessage(""))
      .catch((err) => {
        console.log(err.message);
      });
  }

  const submitChatInvite = async (event) => {
    event.preventDefault();
  }

  return (
    <>
      <Card className='p-2 m-2'>
        <Row className='my-2 text-center'>
          <Col>
            <h2>{chatData.chat_subject}</h2>
          </Col>
          <Col>
            <Button
              onClick={() => {
                //  fetch('api/chat/disconnect', { method: 'POST' });
                setSelectedChatCallback(false);
              }}
            >
              🚫 Close
            </Button>
          </Col>
        </Row>
        {
          userData && chatData && userData.id === chatData.created_by &&
          <Row>
            <Col>
              <Button onClick={async () => {
                setEnableChatInviting(true);
                await fetch(
                  `api/chat/invite?chatId=${chatData.chat_id}`,
                  {
                    method: 'GET'
                  }
                )
                  .then((res) => res.json())
                  .then((data) => { setUserList(data.result) })
                  .catch((err) => console.log(err.message));
              }}
              >
                Invite users
              </Button>
            </Col>
            <Col>
              <Button onClick={async () => {
                setEnableChatModerating(true);
                await fetch(
                  `api/chat/users?chatId=${chatData.chat_id}`,
                  {
                    method: 'GET'
                  }
                )
                  .then((res) => res.json())
                  .then((data) => { setUserList(data.result) })
                  .catch((err) => console.log(err.message))
              }}
              >
                🛡️ Moderate chat
              </Button>
            </Col>
          </Row>
        }
        <div className='my-2'>Messages</div>
        {
          messages.length > 0 && messages.map((message, id) => (
            <Col key={id}>
              <Card
                className={message.fromId === userData.id ? 'messageMine my-1 px-1' : 'messageOther my-1 px-1'}
              >
                <Col>{message.from} @ ⏲ {new Date(message.timestamp).toISOString().slice(0, 16).split("T").join(" ")}</Col>
                <Col>{message.content}</Col>
              </Card>
            </Col>
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
          <Button type='submit'>Send 📨</Button>
        </Form>
      </Card >
      {
        <Modal show={enableChatInviting} backdrop='static' centered>
          <Modal.Header className='text-center'><h2>Invite users</h2></Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitChatInvite}>
              <Form.Group>
                <Form.Control
                  type='text'
                  placeholder={'Find user...'}
                />
              </Form.Group>
              <Button type='submit'>Send invite</Button>
            </Form>
            {
              userList.length > 0 && userList.map((user, id) => (
                <Row className='text-center align-items-center m-2' key={id}>
                  <Col>{user.username}</Col>
                  <Col>
                    <Button onClick={async (e) => {
                      await fetch(
                        `api/chat/invite?chatId=${chatData.chat_id}&userId=${user.id}`,
                        {
                          method: 'POST',
                          header: {
                            'Content-Type': 'application/json'
                          }
                        }
                      )
                        .then((res) => res.json())
                        .then((data) => console.log(data))
                        .catch((err) => console.log(err.message));
                      e.target.disabled = true;
                      e.target.textContent = '✔️'
                      e.target.style.backgroundColor = 'green';
                    }}>
                      ➕
                    </Button>
                  </Col>
                </Row>
              ))
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setEnableChatInviting(false)}>🚫 Close</Button>
          </Modal.Footer>
        </Modal >
      }
      {
        <Modal show={enableChatModerating} backdrop='static' centered>
          <Modal.Header className='text-center'><h2>Moderate users</h2></Modal.Header>
          <Modal.Body>
            {/* <Form onSubmit={{}}>
              <Form.Group>
                <Form.Control
                  type='text'
                  placeholder={'Find user...'}
                />
              </Form.Group>
              <Button type='submit'>Send invite</Button>
            </Form> */}
            {
              userList.length > 0 && userList.map((user, id) => (
                <Row className='text-center align-items-center m-2' key={id}>
                  <Col>{user.username}</Col>
                  <Col>
                    <Button
                      variant={!user.banned ? 'warning' : 'primary'}
                      onClick={async (e) => {
                        await fetch(
                          `api/chat/ban?chatId=${chatData.chat_id}&userId=${user.id}`,
                          {
                            method: 'PUT',
                            header: {
                              'Content-Type': 'application/json'
                            }
                          }
                        )
                          .then((res) => res.json())
                          .then((data) => console.log(data))
                          .catch((err) => console.log(err.message));
                        e.target.disabled = true;
                        e.target.textContent = '✔️'
                        e.target.style.backgroundColor = 'green';
                      }}>
                      {!user.banned ? '🏴 Ban' : '🏳️ Unban'}
                    </Button>
                  </Col>
                </Row>
              ))
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setEnableChatModerating(false)}>🚫 Close</Button>
          </Modal.Footer>
        </Modal >
      }
    </>
  )
}

export default ChatWindow;