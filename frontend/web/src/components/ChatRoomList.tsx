import {ChatRoom} from "../types/ChatRoom"

interface ChatRoomListProps {
    rooms: ChatRoom[];
    onSelectRoom: (room: ChatRoom) => void;
}


function ChatRoomList({ rooms, onSelectRoom }: ChatRoomListProps) {
    return (
        <aside className="chatroom-list">
            <ul>
                {rooms.map(room => (
                    <li key={room.id}>
                        <button onClick={() => onSelectRoom(room)}>
                            {room.name}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default ChatRoomList;
