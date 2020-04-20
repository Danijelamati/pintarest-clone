import React, { useEffect } from 'react';
import axios from "axios";

function GoogleSignUp() {

    useEffect( () =>{

        const access_token = window.location.hash.substr(1).split(/[&=]/g)[1];       
        
        const getToken = async(access_token)=>{
            try{                
                
                const token = await axios({
                    method: "get",
                    url: "/account/google/signup",
                    headers : {"Content-Type":"application/json"},
                    params: {access_token}        
                });
                
                if(!token.data.success){                                                        
                    return window.location.href="/";
                }

                localStorage.setItem("token", token.data.token);  
                
                return window.location.href="/";
            }
            catch(err){                
                return window.location.href="/";
            }
        };

        getToken(access_token);
        
    },[]);
       
    return (
        <div>
            <h3>Signing....</h3>
        </div>
    );
};

export default GoogleSignUp;