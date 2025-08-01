import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainHeader from './components/MainHeader';
import ChatRoomList from './components/ChatRoomList'; 
import UserSetting from './components/UserSetting';
import Message from './components/Message'; 
import AddMember from './components/AddMember';
import MakeGroup from './components/MakeGroup';
import MainFooter from "./components/MainFooter";




function App(){

  interface ChatRoom {
    id: string;
    name: string;
  }
  
  const [rooms, setRooms]= useState<ChatRoom[]>([
    { id: "1", name: "佐藤健一" },
    { id: "2", name: "鈴木花子" },
    { id: "3", name: "高橋一郎" },
  ]);

  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
 


  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    console.log(`Selected room: ${room.name}`);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <MainHeader />
        <Routes>
          <Route path="/user-setting" element={<UserSetting/>} />
          <Route path="/" element={<Message/>} />
          <Route path="/add-member" element={<AddMember />} />
          <Route path="/make-group" element={<MakeGroup />} />
        </Routes>
      </BrowserRouter>
      <div className="chatroom">
      <ChatRoomList rooms={rooms} onSelectRoom={handleSelectRoom} />
    <div className="messages">
      <Message/>
    </div>
    </div>
    <MainFooter/>
    </div>
  );
}

export default App;