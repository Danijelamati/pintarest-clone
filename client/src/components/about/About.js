import React, { useEffect, useState } from 'react';
import axios from "axios";
import ReactMarkdown from "react-markdown";

function About() {

    const [text, setText] = useState("");
    const [error, setError]= useState("");
    

    useEffect( ()=>{
        (async () =>{
            try{
                const getText = await axios({
                    method: "get",
                    url: "/about",
                    headers : {"Content-Type":"application/json"}                    
                  });

                if(!getText.data.success){
                    setError(getText.data.message);
                    return;
                }

                setText(getText.data.text);

            }
            catch(Err){
                return;
            }
        })()
    },[text]);
    return (
        <div className="about">
            <h1 className="about-title">About</h1>
            {
                error ?
                error
                :
                <ReactMarkdown source={text}/>
            }            
        </div>
    );
}

export default About;