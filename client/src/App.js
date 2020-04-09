import React from 'react';
import './App.css';
import DataRouteHub from './DataRouteHub';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <DataRouteHub />
      </div>
    </BrowserRouter>
  );
}

export default App;
