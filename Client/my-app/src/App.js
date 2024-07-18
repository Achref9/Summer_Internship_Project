// Path: /Project-Manager/Client/my-app/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RepoTable from './Components/RepoTable';
import LoginPage from './Components/LoginPage';
import CommitForm from './Components/CommitForm';
import BranchVisualization from'./Components/BranchVisualization'; // Importing the new component
import CommitHistory from './Components/CommitHistory'; // Correct casing


const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/repos" component={RepoTable} />
        <Route path="/commit" component={CommitForm} /> {/* Adding new route */}
        <Route path="/branches/:owner/:repo" component={BranchVisualization} />
        <Route path="/commit-history/:repoOwner/:repoName" component={CommitHistory}/>
          

      </Switch>
    </Router>
  );
};

export default App;
