import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ChatWindow from '../components/ChatWindow';
import ChatCreate from '../components/ChatCreate';

const Chat = ({ userData }) => {
  const [chats, setChats] = useState([]);
  const [chatInvitations, setChatInvitations] = useState([]);
  const [showChatInvitations, setShowChatInvitations] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChat, setNewChat] = useState(false);

  useEffect(() => {
    const getChats = async () => {
      await fetch(
        `api/chats`,
        {
          method: 'GET'
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setChats(data.result);
        })
        .catch((err) => console.log(err.message));
    }

    const getChatInvitations = async () => {
      await fetch(
        'api/chat/invites',
        {
          method: 'GET'
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setChatInvitations(data.result);
        })
        .catch((err) => console.log(err.message));
    }

    getChats();
    getChatInvitations();
  }, []);

  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' {...props}>Chat owner</Tooltip>
  );

  return (
    <>
      <Card className='p-2 m-2 text-center'>
        <Row className='align-items-center'>
          <Col><h1>Chats</h1></Col>
          <Col>
            <Button
              onClick={() => setShowChatInvitations(true)}
              disabled={!chatInvitations.length > 0 ? true : false}
            >
              {!chatInvitations.length > 0 ? 'Pending invites' : `🔔 Pending invites (${chatInvitations.length})`}
            </Button>
          </Col>
        </Row>
        <Card className='p-2 m-2'>
          {
            !selectedChat && chats.length > 0 && !newChat && chats.map((chat, id) => (
              <Button key={id} onClick={() => { setSelectedChat(chat); }} className='my-2 p-2'>
                <Row>
                  <Col>{chat.chat_subject}</Col>
                  <Col>
                    {
                      chat.created_by === userData.id &&
                      <OverlayTrigger
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                      >
                        <div>👑</div>
                      </OverlayTrigger>
                    }
                  </Col>
                </Row>
              </Button>
            ))
          }
          {
            !chats.length > 0 && <div>No chats found</div>
          }
        </Card>
        {
          selectedChat ?
            <ChatWindow chatData={selectedChat} userData={userData} setSelectedChatCallback={setSelectedChat}></ChatWindow>
            :
            <Button onClick={() => setNewChat(true)}>New Chat</Button>
        }
        {
          !selectedChat &&
          newChat && <ChatCreate setSelectedChatCallback={setSelectedChat} setNewChatCallback={setNewChat} />
        }
      </Card>
      {
        <Modal show={showChatInvitations} backdrop='static' centered>
          <Modal.Header className='text-center'><h2>Chat Invitations</h2></Modal.Header>
          <Modal.Body>
            {
              chatInvitations.length > 0 && chatInvitations.map((chat, id) => (
                <Row className='text-center align-items-center m-2' key={id}>
                  <Col>{chat.chat_subject}</Col>
                  <Col>
                    <Button
                      onClick={async (e) => {
                        await fetch(
                          `api/chat/accept-invite/${chat.id}`,
                          {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            }
                          }
                        )
                          .then((res) => res.json())
                          .then((data) => console.log(data))
                          .catch((err) => console.log(err.message));
                        e.target.disabled = true;
                        e.target.textContent = '✅'
                        e.target.style.backgroundColor = 'green';
                      }}
                    >
                      Join
                    </Button>
                  </Col>
                </Row>
              ))
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowChatInvitations(false)}>🚫 Close</Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  )
}

export default Chat;