import React, { useContext } from 'react';

import "./css/Header.scss";
import pita from "./css/pita.png";
import {UserContext} from "./Home";
import Account from "./account/Account";
import Search from './Search';

function Header() {

    const userContext = useContext(UserContext);
    
    return (
        <div className="header">
            <div className="main-title">
                <img onClick={() => userContext.setImages("home")} id={"pita"} src={pita} alt={"pita"}></img>
                <h1 className="title" onClick={() => userContext.setImages("home")}>Pitarest</h1>
            </div>                       
            <Search />
            { userContext.stage === "loading" ?  "Loading..." : <Account />}                      
        </div>
    );
}

export default Header;