// Path: /Project-Manager/Client/my-app/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import RepoTable from './Components/RepoTable';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/repos" component={RepoTable} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
