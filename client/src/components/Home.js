import React, {createContext, useState , useEffect} from 'react';
import axios from "axios";

import './css/Home.scss';
import Header from "./Header";
import Content from "./content/Content";
import AddImage from './content/AddImage';
import AboutButton from './about/AboutButton';

export const UserContext = createContext();

const initialUserState = {
  stage: "loading",
  userName: "",
  token: "",
  savedPins: []
};

function Home() {

  const [user,setUser] = useState(initialUserState);  
  const [images, setImages] = useState("home"); 
  const [search, setSearch] = useState("");  
  const [privilages,setPrivilages] = useState(false);
  
  useEffect( () => {
    async function effect (){

      const storageToken = localStorage.getItem("token") || false;           
      
      if(!storageToken){ 
        setUser( user=>({...user, stage: "anonimus"}));       
        return;
      }

      try{
        const verify = await axios({
          method: "get",
          url: "/account/verify",
          headers : {"Content-Type":"application/json"},
          params: {token : storageToken}
        });
        
        if(verify.data.message !== "Verified"){          
          localStorage.removeItem("token");
          setUser( user=>({...user, stage: "anonimus"})); 
          return;
        }

        if(verify.data.adminPrivilages){
          setPrivilages(true);          
        }

        setUser({
          userName: verify.data.user,
          token: storageToken,
          stage: "signed",
          savedPins: verify.data.savedPins
        });       
        
        
      }
      catch(err){
        console.log(err);
        return;
      }

    }
    effect();
  },[]);  
  
  return (
    <div className="Home">   
      <UserContext.Provider value={{user,setUser,images,setImages,search, setSearch,privilages}}>
        <Header />
        { user.stage !== "loading" ? <Content /> : null}        
        { user.stage === "signed"  ?  <AddImage />: null}  
        <AboutButton />
      </UserContext.Provider>      
    </div>
  );
}

export default Home;

