import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";

import Reply from "./Reply";
import { UserContext } from '../Home';
import time from "../functions/time";

function Comment(props) {

    const {imageId,setAllComments} = props;

    const userContext = useContext(UserContext);

    const [comment, setComment] = useState(props.comment);
    const [refresh, setRefresh] = useState(0);
    const [reply,setReply] = useState("");

    useEffect( () => {
        
    },[refresh]);

    const addReply = async(event,imageId,commentId, reply, user, setComment,setRefresh) => {
        try{            
            event.preventDefault();

            const postReply = await axios({
                "method": "post",
                "url": "/image/reply",
                "headers" : {"Content-Type":"application/json"},
                "data" :{
                    imageId,
                    commentId,
                    reply,
                    token: user.token,
                    userName: user.userName
                }
            });

            if(!postReply.data.success){
                return;
            }
            
            setComment( comm => {
                console.log("array before", comm);
                const array = comm;
                array.replies.push(postReply.data.reply);
                console.log("addreply array", array);
                return array;
            });
            
            setRefresh( r => r+1);

           
        }catch(err){
            return;
        }       
        
    };

    const deleteComment = async (event,user,commentId,imageId,allComm) => {
        try {
            event.preventDefault();

            if( !user || !commentId || !imageId){
                return;
            }
            const del =  await axios({
                "method": "delete",
                "url": "/image/comment",
                "data": {                    
                    token: user.token,
                    userName: user.userName,
                    imageId,
                    commentId
                }
            }); 
        
            if(!del.data.success){
                return;
            }
            
            allComm( comm=>{             
                
                const array = comm.map(x=> x);                
                const index = array.findIndex( c=> c._id === commentId);                
                array.splice(index,1);               
                return array;
            });
            
            
        } catch (error) {
            return;
        }
    }

    return (
        <div className="comment">   
            <div className="comment-content">
                <p className="comment-text">{comment.text}</p>
            </div>            
            <div className="comment-info">               
                {                    
                    userContext.user.userName === comment.author || userContext.privilages ?
                    <div className="comment-delete" onClick={event => deleteComment(event,userContext.user,comment._id,imageId,setAllComments)}>
                        Delete
                    </div>
                    :
                    null
                }                
                <p className="comment-date">{time(comment.createdOn)}</p>
                <p className="comment-author">{comment.author}</p>                
            </div>
            {
                comment.replies.length > 0 ?
                comment.replies.map(reply => <Reply reply={reply} imageId={imageId} commentId={comment._id} setRefresh={setRefresh} setComment={setComment}/>)
                :
                null
            }
            {
                
                userContext.user.stage === "signed" ?

                <form className="reply-add-container">
                    <textarea className="reply-add" placeholder="add your reply here..." onChange={(event) => setReply(event.target.value)} required>

                    </textarea>
                    <button type="reply-submit" onClick={event => addReply(event,imageId,comment._id,reply,userContext.user,setComment,setRefresh)}>
                        Reply
                    </button>
                </form>
                : 
                null
                
            }             
        </div>
    );
}

export default Comment;