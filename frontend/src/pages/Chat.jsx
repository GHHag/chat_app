import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const getChats = async () => {
      await fetch(
        `/api/chats`,
        {
          method: 'GET'
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setChats(data.result);
        });
    }

    getChats();
  }, []);

  return (
    <>
      <main>
        <h1>Chats</h1>
        <Card>
          {
            chats && chats.map((chat, id) => (
              <Row key={id}>
                <Button key={id} onClick={() => { setSelectedChat(chat); }}>
                  {chat.chat_subject}
                </Button>
              </Row>
            ))
          }
        </Card>
        {
          selectedChat &&
          <Card>
            <h3>{selectedChat.chat_subject}</h3>
            <ChatWindow chatData={selectedChat}></ChatWindow>
          </Card>
        }
      </main>
    </>
  )
}

export default Chat;