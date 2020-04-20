import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";

import time from "../functions/time";
import "./../css/SeeImage.scss";
import { UserContext } from '../Home';
import Comments from "./Comments";

function SeeImage(props) {   

    const userContext = useContext(UserContext);

    const [error,setError] = useState("");

    const [image, setImage] = useState([]);   
    const [like, setLike] = useState([]);
    
    useEffect( ()=> {
        console.log("useEffect");
        
        ( async () => {
            try{

                const getImage = await axios({
                    "method": "get",
                    "url": "/image/details",
                    "headers" : {"Content-Type":"application/json"},
                    "params": {
                        imageId: props.id
                    }
                });
                
                if(!getImage.data.success){                    
                    setError(getImage.data.message);
                    return;
                }
                
                setImage(getImage.data.image);

                setLike(getImage.data.image.likes);
                           

            }
            catch(err){
                return;
            }

        })();
    },[props.id]);

    useEffect( () => {
        console.log("useEffect 2");
    },[like]);

   
    

    const handleLikeClick = async (event,user,imageId,img, setImg,setErr,like,setLike) => {
        try{
            event.preventDefault();

            if(user.stage !== "signed"){
                return;
            }

            let action = "unlike";

            if(like.indexOf(user.userName) === -1){
                action = "like";
            }

            const likeImg = await axios({
                "method": "put",
                "url": "/image/like",
                "headers" : {"Content-Type":"application/json"},
                "data": {
                    action,
                    token: user.token,
                    userName: user.userName,
                    imageId
                }
            });
           
            if(!likeImg.data.success){
                setErr(likeImg.data.message);
                return;
            }

            setImg((img) =>{
                let i = img;
                i.likes = [...img.likes, user.userName];                
                return i;
            });
           
            if(action ==="like"){                
                setLike(like => [...like, user.userName]);
                return;
            }
            
            setLike( like => {
                const array = like.map( x=> x);
                const index = array.indexOf(user.userName);
                array.splice(index,1);
                console.log(array)
                return array;
            });

        }
        catch(err){
            return;
        }

    };
    
    const handleDelete = async (event,user, imageId) => {
        try{
            
            event.preventDefault();

            const deleteImg = await axios({
                "method": "delete",
                "url": "/image/delete",
                "data": {                    
                    token: user.token,
                    userName: user.userName,
                    imageId
                }
            });
            
            if(!deleteImg.data.success){
                return;
            }
            window.location.reload();

        }
        catch(err){
            return;
        }
    }

    return (
        <div id="image-see-container">
            {
                image.length !== 0 ?
                <div className="container">
                    <h1 className="image-title">{image.title}</h1><br/>
                    <p className="image-date">{time(image.createdOn)}</p>
                    <div className="image-container">
                        <img className="image-see" src={image.location} alt={image.title} ></img><br/>
                    </div>            
                    <div className="image-info">
                        <div className="like-container">
                            <div className="image-like" onClick={(event) => handleLikeClick(event,userContext.user,props.id,image,setImage,setError,like,setLike)}>
                                {
                                    like.indexOf(userContext.user.userName) === -1 ?
                                    "Like"
                                    :
                                    "unlike"
                                }
                            </div>
                            <h4 className="like-count">{like.length}</h4>
                        </div>
                        <div className="user-corner">
                            {
                                userContext.user.userName === image.owner || userContext.privilages ?
                                <div className="image-delete" onClick={(event => handleDelete(event,userContext.user,image._id))}>
                                    Delete
                                </div>
                                :
                                null
                            }
                            <p className="author">
                                {image.owner}
                            </p>      
                        </div>                                  
                    </div><br/>
                    <p className="image-about">
                        {image.text}
                    </p><br/>
                    {!error ? error : null}
                    <Comments allComments={image.comments} imageId={image._id}/>                                           
            
                </div> 
                :
                null         
            
            }
            
        </div>
    );
}

export default SeeImage;