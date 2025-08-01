export type ChatRoom = {
    id:string;
    name:string;
    //バックエンドのデータベースに合わせて変える
}

type ChatRoomListProps= {
    rooms:ChatRoom[];
    onSelectRoom:(room:ChatRoom) => void;    
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
