import React, {useContext} from 'react';
import axios from "axios";

import time from "../functions/time";
import { UserContext } from '../Home';

function Reply(props) {

    const {reply,imageId,commentId, setRefresh, setComment} = props;

    const userContext = useContext(UserContext);
    
    const deleteReply = async (event,user,imageId,commentId, replyId, setRefresh, setComment) => {
        try{
            event.preventDefault();
           
            const del =  await axios({
                "method": "delete",
                "url": "/image/reply",
                "data": {                    
                    token: user.token,
                    userName: user.userName,
                    imageId,
                    commentId,
                    replyId
                }
            }); 
           
            if(!del.data.success){                
                return;
            }
            
            setComment( comm =>{              
                const array = comm;
                const index = comm.replies.findIndex( x => x._id === replyId);
                array.replies.splice(index,1);
            
                return array;
            });

            setRefresh( r => r+1);

        }
        catch(err){
            return;
        }
    } 

    return (
        <div className="reply">
            <p className="reply-content">
                {reply.text}
            </p>
            <div className="reply-info">
                {
                    userContext.user.userName === reply.author || userContext.privilages ?
                    <div className="reply-delete" onClick={event => deleteReply(event,userContext.user,imageId,commentId, reply._id, setRefresh, setComment)}>
                         Delete
                    </div>
                    : 
                    null
                }   
                <p className="reply-date">
                    {time(reply.createdOn)}
                </p>
                <p className={"reply-author"}>
                    {reply.author}
                </p>
            </div>
        </div>
    );
}

export default Reply;