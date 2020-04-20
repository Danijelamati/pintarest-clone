import React,{useState} from 'react';
import axios from "axios";

const initialInfoState = {
    email: "",
    password: "",
    userName: ""
};

const SignUp = () => {

    const [info,setInfo] = useState(initialInfoState); 
    const [error,setError] = useState("");       
    
    const newUserSignUp = (event, inf) => {

        event.preventDefault(); 
        
        axios({
            method: "post",
            url: "/account/signup",
            headers : {"Content-Type":"application/json"},
            data: inf
        })
        .then(res => {
            const {data} = res;
            if(data.message !== "signed up"){                
                setError(data.message);
                return;
            }
            
            localStorage.setItem("token", data.token);            

            window.location.reload();
            
        });          
    };

    const githubSignIn = (event,setErr) => {
        
        event.preventDefault(); 
  
        axios({
            method: "get",
            url: "/account/github/clientid",
            headers : {"Content-Type":"application/json"}        
        })
        .then( res => {

            if(!res.data){
                setErr({error: "Something went wrong"});
                return;
            }            
            
            window.location.href=`https://github.com/login/oauth/authorize?client_id=${res.data.clientID}`;            
        })
        .catch(err =>{
            setErr({error: "Something went wrong"});
            return;
        });
    };

    const googleSignIn = (event,setError) => {

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
            setError({error: "Something went wrong"});
            return;
        });
    };


    return (
        <div>
            <button onClick={event => githubSignIn(event,setError)}>Sign with git hub</button> 
            <button onClick={event => googleSignIn(event,setError)}>Sign with google</button>   
            <form>                                
                <h2>SignUp</h2>
                <label>Email:</label>
                <input type="email" name="email" onChange={event => setInfo({...info,email: event.target.value})} required></input><br/>
                <label>Password:</label>
                <input type="password" name="password" onChange={event => setInfo({...info, password: event.target.value})} required></input><br/>
                <label>UserName:</label>
                <input type="text" name="userName" onChange={event => setInfo({...info, userName: event.target.value})} required></input><br/>
                <button name="submit" onClick={(event) => newUserSignUp(event,info)}>SignUp</button><br/>              
                         
            </form>

            {error !== "" ? error : "" }  
        </div>
    );
};

export default SignUp;