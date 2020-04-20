import React,{useContext} from 'react';
import axios from "axios";
import {UserContext} from "../Home";

function LogOut() {

    const userContext = useContext(UserContext);

    const logOutUser = async(user,setUser) => {
        
        try {
            const logOut = await axios({
                method: "get",
                url: "/account/logout",
                headers : {"Content-Type":"application/json"},
                params: {token : user.token}
            });           
            
            if(logOut.data.message !== "User logged out"){
                console.log("error");
                return;
            }           

            localStorage.removeItem("token");
            
            window.location.reload();

       } catch (err) {
           console.log(err);
           return;
       }
    };
    return (
        <>
            <div className="account-button" onClick={ () => {logOutUser(userContext.user,userContext.setUser)}}>LogOut</div>
        </>
    );
}

export default LogOut;