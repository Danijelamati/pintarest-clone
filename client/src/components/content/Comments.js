import React , {useState, useContext, useEffect} from 'react';
import axios from "axios";

import "../css/Comments.scss";
import Comment from "./Comment";
import { UserContext } from '../Home';

function Comments(props) {

    const userContext = useContext(UserContext);
    
    const [newComment, setNewComment] = useState("");
    const [allComments, setAllComments] = useState(props.allComments);

    const {imageId} = props;     

    useEffect( () => {
        
    },[allComments]);

    const addComment = async(event,imageId,comment,user,setAllComments) => {
        try{
            event.preventDefault();
            
            const postComment = await axios({
                "method": "post",
                "url": "/image/comment",
                "headers" : {"Content-Type":"application/json"},
                "data" :{
                    imageId,
                    comment,
                    token: user.token,
                    userName: user.userName
                }
            });

            setAllComments(comm =>[...comm,postComment.data.newComment]);
        }catch(err){
            return;
        }       
        
    };

    return (
        <div className="comments">            
            {
                allComments.length !== 0 ?
                allComments.map(comm => <Comment comment={comm} imageId={imageId} setAllComments={setAllComments} />)
                :
                null
            }
            {
                        userContext.user.stage === "signed" ?
                        <form className="comment-add-container">
                            <textarea className="comment-add" placeholder="add your comment here..." onChange={(event) => setNewComment(event.target.value)} required>

                            </textarea>
                            <button className="comment-submit" onClick={event => addComment(event,imageId,newComment,userContext.user,setAllComments)}>
                                Comment
                            </button>
                        </form>
                        : 
                        null
            }           
        </div>
    );
}

export default Comments;