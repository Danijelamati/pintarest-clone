import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

import Home from "./components/Home";
import GithubCallback from './components/callbackRoutes/GithubCallback';
import GoogleCallback from "./components/callbackRoutes/GoogleCallback";
import Admin from "./components/Admin/Admin";



function App() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/account/github/callback">
                        <GithubCallback />
                    </Route>   
                    <Route exact path="/account/google/callback">
                        <GoogleCallback />
                    </Route>   
                    <Route exact path="/admin">
                        <Admin />
                    </Route>                   
                </Switch>
            </Router>
        </div>
    );
}

export default App;