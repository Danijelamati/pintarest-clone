import React, { useContext, useState } from 'react';
import Modal from "react-modal";

import PinIt from "./PinIt";
import {UserContext} from "../Home";
import SeeImage from './SeeImage';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      width                 : "40vw",
      height                : "40vw",
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };


function Image(props) {

    const [seeImageModal, seeImageModalOpen] = useState(false);
    const userContext = useContext(UserContext);  
    

    const openSeeImageModal = () => {
        seeImageModalOpen(true);
      }
    
    function closeSeeImageModal(){
        seeImageModalOpen(false);
    }

        
    
    return (
        <div className="pin" key={props.img._id}>
            <h2 className="img-title">{props.img.title}</h2>
            {
                userContext.user.stage === "signed" ? 
                <PinIt imgId={props.img._id}/>
                :
                null
            }            
            <img className="image" src={props.img.location} alt={Image.title} onClick={() => openSeeImageModal()}></img>

            <Modal
                isOpen={seeImageModal}                    
                onRequestClose={closeSeeImageModal}
                style={customStyles}
                contentLabel="See Image Modal"                
            >
                <SeeImage id={props.img._id} />                
            </Modal>   
        </div>      
    );
}

export default Image;