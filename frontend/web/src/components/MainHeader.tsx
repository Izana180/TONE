import SelectTopic from "./SelectTopic";
import { Topic } from "../types/Topic";

function MainHeader(){

    return(
        <header className="main-header">
            <nav>
                <ul>
                    <li><a href="/user-setting"><img src="src/assets/icon.png" className="icon" alt="User Icon"/></a></li>
                    <li><a href="/"><img src="src/assets/chat.png" className="icon" alt="Chat Icon"/></a></li>
                    <li><a href="/add-member"><img src="src/assets/memberAdd.png" className="icon" alt="Add Icon"/></a></li>
                    <li><a href="/make-group"><img src="src/assets/groupMake.png" className="icon" alt="Make Icon"/></a></li>
                </ul>
            </nav>
        </header>
    )
}

export default MainHeader;