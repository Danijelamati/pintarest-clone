import React, { useState } from "react"
import Modal from "react-modal";

import SignUp from "./SignUp";
import LogIn from "./LogIn";

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

function Anonimus(){

    const[logInModal, logInModalOpen] = useState(false);
    const[signUpModal, signUpModalOpen] = useState(false);    

    function openSignUpModal() {
        signUpModalOpen(true);
      }
    
    function closeSignUpModal(){
        signUpModalOpen(false);
    }

    function openLogInModal() {
        logInModalOpen(true);
      }
    
    function closeLogInModal(){
        logInModalOpen(false);
    }  

    return (
        <>        
            <div className="account-button" onClick={openSignUpModal}>SignUp</div>    
            <div className="account-button" onClick={openLogInModal}>Log In</div> 
            <Modal
                isOpen={signUpModal}                    
                onRequestClose={closeSignUpModal}
                style={customStyles}
                contentLabel="Sign Up Modal"
            >
                <SignUp />
            </Modal>  

            <Modal
                isOpen={logInModal}                    
                onRequestClose={closeLogInModal}
                style={customStyles}
                contentLabel="Log In Modal"
            >
                <LogIn />
            </Modal>           
                     
        </>
    );
}

export default Anonimus;