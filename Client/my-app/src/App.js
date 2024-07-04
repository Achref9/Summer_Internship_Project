// Path: /Project-Manager/Client/my-app/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RepoTable from './Components/RepoTable';
import LoginPage from './Components/LoginPage';
import CommitForm from './Components/CommitForm'; // Importing the new component

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/repos" component={RepoTable} />
        <Route path="/commit" component={CommitForm} /> {/* Adding new route */}
      </Switch>
    </Router>
  );
};

export default App;
