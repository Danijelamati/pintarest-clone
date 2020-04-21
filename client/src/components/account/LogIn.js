import React,{useState} from 'react';
import axios from "axios";

const initialLogState = {
    email: "",
    password: ""
};


const LogIn = () => {

    const [log,setLog] = useState(initialLogState); 
    const [error,setError] = useState("");


    const logIn = async(event,logInfo) => {
        try {
            event.preventDefault();
            
            const logIn = await axios({
                method: "post",
                url: "/account/login",                
                headers : {"Content-Type":"application/json"},
                data: logInfo
            });
            
            if(!logIn.data.success){
                setError(logIn.data.message);
                return;
            }
            
            localStorage.setItem("token",logIn.data.token);

            window.location.reload();

        } catch (err) {            
            return;
        }
    };

    const githubLogIn = (event,setErr) => {

        event.preventDefault(); 
        
        axios({
            method: "get",
            url: "/account/github/clientid",
            headers : {"Content-Type":"application/json"}        
        })
        .then( res => {            
            
            if(!res.data){
                setErr({error: "Something went wrong"});
                return "";
            }            
            
            window.location.href=`https://github.com/login/oauth/authorize?client_id=${res.data.clientID}`;            
        })
        .catch(err =>{
            setErr("Error: something went wrong");
            return;
        });
    };

    const googleLogIn = (event,setError) => {

        event.preventDefault();

        axios({
            method: "get",
            url: "/account/google/clientid",
            headers : {"Content-Type": "application/json"}
        })
        .then(
            res => {

                if(!res.data){
                    setError({error: "Something went wrong"});
                    return;
                }

                window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?client_id=${res.data.clientID}&redirect_uri=http://localhost:3000/account/google/callback&response_type=token&scope=https://www.googleapis.com/auth/userinfo.profile`;
            }
        ).catch(err =>{
            setError("Something went wrong");
            return;
        });
    };

    return (
        <div>
            <button onClick={event => githubLogIn(event,setError)}>LogIn with git hub</button> 
            <button onClick={event => googleLogIn(event,setError)}>LogIn with google</button>   
            <form>
                <h2>LogIn</h2>            
                <label>Email:</label>
                <input type="email" name="email" onChange={event => setLog({...log,email: event.target.value})} required></input><br/>
                <label>Password:</label>
                <input type="password" name="password" onChange={event => setLog({...log, password: event.target.value})} required></input><br/>
                <button onClick={(event) => logIn(event,log)}>Log In</button>
            </form>
            {error !== "" ? error  : null}
        </div>        
    );
};

export default LogIn;