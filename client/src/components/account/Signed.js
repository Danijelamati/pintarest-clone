import React, { useContext } from "react";

import {UserContext} from "../Home";
import LogOut from "./LogOut";
import Delete from "./DeleteAcc";


function Signed(){    

    const userContext = useContext(UserContext);  

    return (
        <>  
            <div className="account-button" onClick={ () => userContext.setImages("mypins")}>MyPins</div>
            <div className="account-button" onClick={ () => userContext.setImages("saved")}>Saved</div>      
            <div className="user-button">{userContext.user.userName}</div>
            <LogOut />      
            <Delete />                  
                     
        </>
    );
}

export default Signed;