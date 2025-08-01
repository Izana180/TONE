import React, { useState } from 'react';

interface Message {
  id: number;
  sender: string;
  content: string;
}
function Message(){
    return (
        <div className="chat-room">
            <h2>Chat Room</h2>
            <div className="messages">
                message<br/>
                <img src="src/assets/play.png" id="play"/>
            </div>
        </div>
    )
}
export default Message;