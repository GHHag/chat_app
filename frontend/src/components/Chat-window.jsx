import React, { useState, useEffect } from 'react';

const ChatWindow = ({ chatData }) => {
  console.log(chatData);
  //const [chat, setChat] = useState(chatData);
  //const [x, setX] = useState([]);

  /*   useEffect(() => {
      const getChat = async () => {
        await fetch(
          `/api/chat/messages/${chatData.id}`,
          {
            method: 'GET'
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setChat(data.result)
          });
  
        getChat();
      }
    }, []); */

  return (
    <>
      <h2>{'kekw'}</h2>
      <div>DUNDERCHATT</div>
    </>
  )
}

export default ChatWindow;