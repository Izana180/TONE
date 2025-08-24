import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainHeader from './components/MainHeader'; 
import UserSetting from './components/UserSetting';
import AddMember from './components/AddMember';
import MakeGroup from './components/MakeGroup';
import ChatPage from './components/ChatPage';
import { ChatRoom } from './types/ChatRoom';
import { Topic } from './types/Topic';

function App() {
  const [rooms, setRooms] = useState<ChatRoom[]>([
    { id: "1", name: "佐藤太郎" },
    { id: "2", name: "鈴木花子" },
    { id: "3", name: "高橋一郎" },
  ]);

  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    console.log(`Selected room: ${room.name}`);
  };

  const handleTopicChange = (topic: Topic | null) => {
    setSelectedTopic(topic);
    console.log('Topic changed:', topic);
  };

  return (
    <div className="App">
      <BrowserRouter>
      <MainHeader/>
        <Routes>
          <Route path="/" element={
            <ChatPage 
              rooms={rooms} 
              selectedRoom={selectedRoom}
              onSelectRoom={handleSelectRoom}
              selectedTopic={selectedTopic}
              onTopicChange={handleTopicChange}
            />
          } />
          <Route path="/user-setting" element={<UserSetting />} />
          <Route path="/add-member" element={<AddMember />} />
          <Route path="/make-group" element={<MakeGroup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;