import playImg from '../assets/play.png';

function Message(){
    return (
        <div className="chat-room">
            <h2>Chat Room</h2>
            <div className="messages">
                message<br/>
                <img src={playImg} id="play" alt="play"/>
            </div>
        </div>
    )
}
export default Message;