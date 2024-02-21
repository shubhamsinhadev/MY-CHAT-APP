import './App.css'
import Header from './Components/Header'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import Chat from './Components/Chat';
import io from "socket.io-client";
import { useState } from 'react';
const socket = io('https://my-chat-backend-b2o3.onrender.com/');


function App() {

  const [username, setUsername] = useState('')


  return (
    <div className=' relative'>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home setUsername={setUsername} username={username}/>} />
          <Route path="/chat" element={<Chat socket={socket} username={username} />} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
