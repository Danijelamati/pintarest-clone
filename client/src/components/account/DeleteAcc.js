import React, { useContext } from 'react';
import axios from "axios";
import { UserContext } from '../Home';


function DeleteAcc() {

    const userContext = useContext(UserContext);

    const deleteAccount = async (event,user) => {
        try{
            event.preventDefault();

            const deleteAcc = await axios({
                "method": "delete",
                "url": "/account/delete",
                data:{
                    token: user.token,
                    userName: user.userName
                }
            });
            
            if(!deleteAcc.data.success){
                return;
            }

            localStorage.removeItem("token");
            
            window.location.reload();
        }
        catch(err){
            return;
        }
    };

    return (
        <div className="account-button" onClick={event => deleteAccount(event,userContext.user)}>
            Delete
        </div>
    );
}; 

export default DeleteAcc;