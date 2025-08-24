import ChatRoomList from "./ChatRoomList";
import Message from "./Message";
import MainFooter from "./MainFooter";
import ChatHeader from "./ChatHeader";
import { Topic } from "../types/Topic";
import { ChatRoom } from "../types/ChatRoom";

type ChatPageProps = {
  rooms: ChatRoom[];
  onSelectRoom: (room: ChatRoom) => void;
  selectedRoom: ChatRoom | null;
  selectedTopic: Topic | null;
  onTopicChange: (topic: Topic | null) => void;
};

const ChatPage: React.FC<ChatPageProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  selectedTopic,
  onTopicChange,
}) => {
  return (
    <div className="chat-page">
      <aside className="chatroom-list">
        <ChatRoomList rooms={rooms} onSelectRoom={onSelectRoom} />
      </aside>
      <main className="chat-main">
        <ChatHeader
          selectedRoom={selectedRoom}
          selectedTopic={selectedTopic}
          onTopicChange={onTopicChange}
        />
        <div className="chat-content">
          {selectedRoom ? (
            <Message />
          ) : (
            <div className="no-room-selected">
              <p>ルームを選択してください</p>
            </div>
          )}
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default ChatPage;