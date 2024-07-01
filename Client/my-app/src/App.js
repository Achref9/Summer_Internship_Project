import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './LoginPage';
import RepoTable from './RepoTable';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/repos" element={<RepoTable />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
