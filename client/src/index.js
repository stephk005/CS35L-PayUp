import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import Welcome from './Welcome';
import App from './App'
import Header from './Header';
import HomeHeader from './HomeHeader'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Login /> */}
    {/* <Welcome /> */}
    {/* <Header /> */}
    <App />
    {/* <HomeHeader /> */}

  </React.StrictMode>
);

