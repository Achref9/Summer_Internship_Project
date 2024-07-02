import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './LoginPage';
import RepoTable from './RepoTable';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/repos" component={RepoTable} />
        <Route exact path="/" component={Login} />
      </Switch>
    </Router>
  );
};

export default App;
