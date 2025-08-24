import SelectTopic from "./SelectTopic";
import { Topic } from "../types/Topic";
import { ChatRoom } from "../types/ChatRoom";
import allPlayIcon from "../assets/allPlay.png";
type ChatHeaderProps = {
  selectedRoom: ChatRoom | null;
  selectedTopic: Topic | null;
  onTopicChange: (topic: Topic | null) => void;
};

const handlePlayAll = () => {
  console.log('全体再生ボタンがクリックされました');
  // ここに全体再生の処理を追加
};

function ChatHeader({ selectedRoom, selectedTopic, onTopicChange }: ChatHeaderProps) {
  return (
    <div className="chat-header">
      <div className="selected-room-info">
        {selectedRoom ? (
          <h2 className="room-name">{selectedRoom.name}</h2>
        ) : (
          <h2 className="room-name">ルームが選択されていません</h2>
        )}
      </div>
      <div className="topic-selector">
        <SelectTopic onTopicChange={onTopicChange} />
      </div>
      <div className="all-play">
        <button 
          className="play-all-button" 
          onClick={handlePlayAll}
          title="全て再生"
        >
          <img src={allPlayIcon} className="icon" alt="allPlay"/>
        </button>
    </div>
    </div>
  );
}

export default ChatHeader;