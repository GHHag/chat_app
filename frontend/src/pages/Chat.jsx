import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ChatWindow from '../components/ChatWindow';
import ChatCreate from '../components/ChatCreate';


const Chat = () => {
  const [chats, setChats] = useState([]);
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
        });
    }

    getChats();
  }, [chats]);

  return (
    <>
      <Card className='p-2 m-2'>
        <Row><h1>Chats</h1></Row>
        <Card className='p-2 m-2'>
          {
            !selectedChat && chats.length > 0 && !newChat && chats.map((chat, id) => (
              <Button key={id} onClick={() => { setSelectedChat(chat); }} className='my-2 p-2'>
                {chat.chat_subject}
              </Button>
            ))
          }
          {
            !chats.length > 0 && <div>No chats found</div>
          }
        </Card>
        {
          selectedChat ?
            <ChatWindow chatData={selectedChat} setSelectedChatCallback={setSelectedChat}></ChatWindow>
            :
            <Button onClick={() => setNewChat(true)}>New Chat 💬</Button>
        }
        {
          !selectedChat &&
          newChat && <ChatCreate setSelectedChatCallback={setSelectedChat} setNewChatCallback={setNewChat} />
        }
      </Card>
    </>
  )
}

export default Chat;