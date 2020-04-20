import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import { UserContext } from '../Home';


function PinIt(props) {

    const userContext = useContext(UserContext);
    const [pin,setPin] = useState("");
   
    
    useEffect(
        () => {
            console.log("pinnnnn")
            const index = userContext.user.savedPins.indexOf(props.imgId);
            if (index === -1){
                setPin("PIN");
                return;
               
            }
            
            setPin("UNPIN");
            
        },[props.imgId,userContext.user.savedPins],
    );
    
       
    const handleClick = async (event,user,imageId,pin) => {
        try{
            event.preventDefault();              
           
            const action = pin.toLowerCase();
            
            const task = await axios({
                method: "post",
                url: "/user/savepin",                
                headers : {"Content-Type":"application/json"},
                data:{
                    token: user.token,
                    userName: user.userName,
                    imageId,
                    action
                }
              });

            if(!task.data.success){
                return;
            }

            setPin(task.data.setAction);          

            
        }
        catch(err){
            return;
        }
        
    }

    return (
        <div className="save" onClick={event => handleClick(event,userContext.user,props.imgId,pin)}>
            {pin}
        </div>
    );
}

export default PinIt;