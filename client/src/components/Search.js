import React, {useContext, useState} from 'react';

import {UserContext} from "./Home";

function Search() {

    const userContext = useContext(UserContext);

    const [searchTags, setSearchTags] = useState("");    
    
    const handleSearch = (event,setImg,setSearch, searchTags) => {
        event.preventDefault();
        setSearch(searchTags);
        setImg("search");
    }
  
    return (
        <form className="search">
                <input className="search-input" type={"text"} onChange={ event => setSearchTags(event.target.value)} required></input>
                <div className="search-submit" id="submit" onClick={event => handleSearch(event,userContext.setImages,userContext.setSearch,searchTags)}>Search</div>
        </form>
    );
}

export default Search;