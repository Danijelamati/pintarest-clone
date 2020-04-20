import React,{useState} from 'react';
import Modal from "react-modal";
import About from './About';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
}};

function AboutButton() {

    const [aboutModal, aboutModalOpen] = useState(false); 
    

    function openAboutModal() {
        aboutModalOpen(true);
    };
    
    function closeAboutModal(event){
        
        event.stopPropagation();
        aboutModalOpen(false);
    };   

    return (
        <div className="about-button" onClick={()=> openAboutModal()}>
            ?
            <Modal
              isOpen={aboutModal}                    
              onRequestClose={(event)=>closeAboutModal(event)}
              style={customStyles}
              contentLabel="About Modal"
            >
                <About />
            </Modal>
        </div>
    );
}

export default AboutButton;