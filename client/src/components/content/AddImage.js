import React, {useState, useContext, useEffect} from 'react';
import Modal from "react-modal";
import axios from "axios";

import {UserContext} from "../Home";

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
}};

const imageDef = { 
    file: null,
    title: "",
    text: ""
  };
  
function AddImage() {   

    const [addModal, addModalOpen] = useState(false);       
    const [image, setImage] = useState(imageDef); 
    const [error,setError] = useState("");
    
    const userContext = useContext(UserContext);

    useEffect( () => {
        setImage(imageDef);
        setError("");
    },[addModal]);
   

    const postPin = async (event, setErr, user, img) => {
        try{              
                  
            event.preventDefault(); 

            if(!user.userName || !user.token){
                setErr("error: missing user");
                return;
            }

            if(!img.file || !img.title){
                setErr("error: invalid credentials");
                return;
            }            
            
            const getUrl = await axios({
                method: "get",
                url: "/image/upload",
                headers : {"Content-Type":"application/json"},
                params: {
                    token: user.token,
                    userName: user.userName,
                    img: img.file.name,
                    text: img.text,
                    title: img.title 
                    }
              });
            
            if(!getUrl.data.success){
                setErr(getUrl.data.message);
                return;
            }
            
            const upload = await axios.put(getUrl.data.url,img.file, { 
                    headers: {
                        "Content-Type": img.file.type
                    }
            });
            
            if(upload.statusText !== "OK"){
                setErr("error: server error");
                return;
            }

            window.location.reload();
        }
        catch(err){
            console.log(err);
            setErr("error: server error");
            return;
        }       
    };

    function openAddModal() {
        addModalOpen(true);
    };
    
    function closeAddModal(){
        addModalOpen(false);
    };   


    return (
        <div add-wrapper>
            <div className="add" onClick={openAddModal}>+</div>
            <Modal
              isOpen={addModal}                    
              onRequestClose={closeAddModal}
              style={customStyles}
              contentLabel="Add Modal"
            >
                <form>
                    <h5>Image</h5><br/>
                    <input type="file" accept="image/*" onChange={(event) => setImage({...image,file: event.target.files[0]})} required></input><br/>                   
                    <span>Title</span><br/>
                    <input type="text" onChange={(event) => setImage({...image,title: event.target.value})} required></input><br/>
                    <span>About</span><br/>              
                    <textarea id="descripiton" col="50" rows="10" onChange={(event) => setImage({...image,text: event.target.value})}></textarea><br/>
                    <button type="submit" onClick={(event) => postPin(event,setError,userContext.user,image)}>Pin image</button><br/>
                    {error === "" ? null : error}
                </form>             

            </Modal>  
          </div>
    );
};

export default AddImage;
