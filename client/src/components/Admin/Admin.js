import React, { useState } from 'react';
import axios from "axios";

function Admin() {

    
    const [newAdmin, setNewAdmin] = useState({
        userName: "",
        password: "",
        invite: ""
    });
    
    const [logAdmin, setLogAdmin] = useState({
        userName: "",
        password: ""
    });


    const handleNewAdmin = async (event,admin) => {
        try{
            event.preventDefault();

            if(!admin.userName || !admin.password || !admin.invite){
                return;
            }
            const newAdmin = await axios({
                "method": "post",
                "url": "/admin",
                "headers" : {"Content-Type":"application/json"},
                "data": {
                    userName: admin.userName,
                    password: admin.password,
                    invite: admin.invite
                }
            });

            if(!newAdmin.data.success){
                return;
            }

            localStorage.setItem("token",newAdmin.data.token);
            
            console.log(newAdmin);

            return window.location.href="/";
        }
        catch(Err){
            return;
        }
    };

    const handleAdminLogin = async (event,login) => {
        try{
            event.preventDefault();
            console.log("hit")
            if(!login.userName || !login.password){
                return;
            }

            const loginAdmin = await axios({
                "method": "get",
                "url": "/admin",
                "headers" : {"Content-Type":"application/json"},
                "params": {
                    userName: login.userName,
                    password: login.password
                }
            });

            console.log(loginAdmin);

            if(!loginAdmin.data.success){
                return;
            }

            localStorage.setItem("token",loginAdmin.data.token);
            
            console.log(loginAdmin);

            return window.location.href="/";
        }
        catch(Err){
            return;
        }
    };

    return (
        <div>
            <form>
                <h2>New Admin account</h2><br/>
                <span>Invite token</span><br/>
                <input type="text" onChange={event => setNewAdmin({...newAdmin, invite: event.target.value})} required></input><br/>
                <span>User name</span><br/>
                <input type="text" onChange={event => setNewAdmin({...newAdmin, userName: event.target.value})} required></input><br/>
                <span>Password</span><br/>
                <input type="password" onChange={ event => setNewAdmin({...newAdmin, password: event.target.value})}  required></input><br/>
                <button type="submit" onClick={event => handleNewAdmin(event,newAdmin)}>Submit</button><br/>
            </form>
            <form>
                <h2>Admin login</h2><br/>                
                <span>User name</span><br/>
                <input type="text" onChange={event => setLogAdmin({...logAdmin, userName: event.target.value})} required></input><br/>
                <span>Password</span><br/>
                <input type="password" onChange={event => setLogAdmin({...logAdmin, password: event.target.value})} required></input><br/>
                <button type="submit" onClick={event => handleAdminLogin(event,logAdmin)}>Submit</button><br/>
            </form>            
        </div>
    );
}

export default Admin    