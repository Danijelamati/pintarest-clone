import React, { useContext } from 'react';
import {UserContext} from"../Home";

import Anonimus from "./Anonimus";
import Signed from "./Signed";

const Account = () => {   

    const userContext = useContext(UserContext);

    return(
        <div className={"account"}>
            { userContext.user.stage==="signed" ? <Signed /> : null}
            { userContext.user.stage==="anonimus" ? <Anonimus /> : null}
        </div>
    ) 

};

export default Account;