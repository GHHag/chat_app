import { useEffect, useState, useContext } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, redirect, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Header from './components/Header';

function App() {
  //const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/login`, { method: 'GET' });
      const responseJson = await response.json();
      console.log(responseJson.user);
      if (responseJson.user) {
        setUser(responseJson.user);
        //navigate("/chat");
      }
    }

    getUser();
  }, []);

  /* let userContext = useContext("");
console.log(userContext);

useEffect(() => {
const getUser = async () => {
  const response = await fetch(`/api/user/login`, { method: 'GET' });
  //const response = await fetch(`http://localhost:3000/api/user/login`, { method: 'GET' });
  const responseJson = await response.json();
  console.log(responseJson);
  userContext = responseJson;
}

getUser();
}, []); */

  /* const startSSE = () => {
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
    })
  }

  useEffect(() => {
    startSSE()
  }, []); */

  return (
    <main>
      <BrowserRouter>
        <Header user={user} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/chat' element={<Chat />} />
        </Routes >
      </BrowserRouter >
    </main >
  );
}

export default App;
