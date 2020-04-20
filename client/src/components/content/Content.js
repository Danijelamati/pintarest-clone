import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import Masonry from "react-masonry-css";

import Image from "./Image";
import "../css/Content.scss";
import {UserContext} from "../Home";

const breakpointCols = {
  default: 7,
  1900: 6,
  1600: 5,
  1300: 4,
  1000: 3,
  700: 2
};


function Content() {
    
    const [error,setError] = useState("");
    const [files,setFiles] = useState([]);
    
    const userContext = useContext(UserContext);

    useEffect( () => {
      console.log("content");
        switch(userContext.images){

            case "home":
              (async () => {
                try{
                  const getImages = await axios({
                    method: "get",
                    url: "/content",                
                    headers : {"Content-Type":"application/json"}
                  });

                  if(!getImages.data.success){
                    setFiles([]);
                    setError(getImages.data.message);
                    return;
                  } 
                  setFiles(getImages.data.images);

                  return;
                }
                catch(err){
                  setFiles([]);
                  setError("server error");
                  return;
                }
              })();
              break;


            case "mypins":
              (async () => {
                try{

                  if(!userContext.user.token || !userContext.user.userName){
                    setError("error");
                    setFiles([]);
                    return;
                  }

                  const myImages = await axios({
                    method: "get",
                    url: "/user/mypins",
                    headers : {"Content-Type": "application/json"},
                    params:{
                        token: userContext.user.token,
                        userName: userContext.user.userName,
                        action: "mypins"
                    } 
                  });

                  if(!myImages.data.success){
                    setFiles([]);
                    setError(myImages.data.message);
                    return;
                  }
        
                  setFiles(myImages.data.images);
                }
                catch(err){
                  setFiles([]);
                  setError("server error");
                  return;
                }
              })();
              break;



            case "saved":
              (async () => {
                try{

                  if(!userContext.user.token || !userContext.user.userName){
                    setError("error");
                    setFiles([]);
                    return;
                  }

                  const myImages = await axios({
                    method: "get",
                    url: "/user/mypins",
                    headers : {"Content-Type": "application/json"},
                    params:{
                        token: userContext.user.token,
                        userName: userContext.user.userName,
                        action: "saved"
                    } 
                  });

                  if(!myImages.data.success){
                    setFiles([]);
                    setError(myImages.data.message);
                    return;
                  }
        
                  setFiles(myImages.data.images);
                }
                catch(err){
                  setFiles([]);
                  setError("server error");
                  return;
                }
              })();
              break;


            case "search":
              (async ()=>{
                try {
                  const getImages = await axios({
                    method: "get",
                    url: "/image/search",
                    headers : {"Content-Type": "application/json"},
                    params:{
                        search: userContext.search
                    } 
                  });

                  if(!getImages.data.success){
                    setFiles([]);
                    setError(getImages.data.message);
                    return;
                  }

                  setFiles(getImages.data.images);

                } catch (error) {
                  setFiles([]);
                  setError("server error");
                  return;
                }
              })();
              break;

            default:
              setFiles([]);
              setError("server error");
              return;
          };

    },[userContext.images, userContext.search, userContext.user.token ,userContext.user.userName]);  


    return (
        <div className={"content"}>
            {
                error !== "" ? error :
                <div className={"grid"} >
                    <Masonry
                        breakpointCols={breakpointCols}
                        className="grid"
                        columnClassName="grid_column">                            
                        {
                            
                            files.length === 0?
                            null
                            :
                            files.map(img => <Image img={img}/>)
                            
                        }
                    </Masonry>
            </div> 
            }           
            
        </div>
    );
}

export default Content;