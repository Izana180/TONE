import { Link } from "react-router-dom";
import iconImg from "../assets/icon.png";
import chatImg from "../assets/chat.png";
import memberAddImg from "../assets/memberAdd.png";
import groupMakeImg from "../assets/groupMake.png";


function MainHeader(){
    return(
        <header className="main-header">
            <nav>
                <ul>
                     <li><Link to="/user-setting"><img src={iconImg} className="icon" alt="User Icon"/></Link></li>
                    <li><Link to="/"><img src={chatImg} className="icon" alt="Chat Icon"/></Link></li>
                    <li><Link to="/add-member"><img src={memberAddImg} className="icon" alt="Add Icon"/></Link></li>
                    <li><Link to="/make-group"><img src={groupMakeImg} className="icon" alt="Make Icon"/></Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default MainHeader;