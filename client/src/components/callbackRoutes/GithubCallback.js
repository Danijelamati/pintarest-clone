import React, { useEffect } from 'react';
import axios from "axios";

function GithubSignUp() {

    useEffect( () =>{

        const parameters = new URLSearchParams(window.location.search);
        
        const getToken = async(params)=>{
            try{
                const code = params.get("code");
                
                const token = await axios({
                    method: "get",
                    url: "/account/github/signup",
                    headers : {"Content-Type":"application/json"},
                    params: {code}        
                });

                if(!token.data.success){                    
                    
                    return window.location.href="/";
                }

                localStorage.setItem("token", token.data.token);  
                
                return window.location.href="/";
            }
            catch(err){
                console.log("error");
                return window.location.href="/";
            }
        };

        getToken(parameters);

    },[]);

    return (
        <div>
            <h3>Signing....</h3>
        </div>
    );
};

export default GithubSignUp;