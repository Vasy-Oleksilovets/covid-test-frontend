// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import 'react-notifications/lib/notifications.css';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import './App.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import "react-datepicker/dist/react-datepicker.css";
import AlertTemplate from 'react-alert-template-basic'

import AuthContextProvider from './context/AuthContext';
import ProfileContextProvider from './context/ProfileContext';

import App from './views/App.js';
// layouts
const { host, pathname } = window.location;
console.log("host", host);
if (host.includes('cloudfront')) {
  console.log("should be redirected", window.location);
  window.location.href = `http://portal.rxrapidtesting.com${pathname}`;
  // window.location.host = 'portal.rxrapidtesting.com';
}

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_LEFT,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
}

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <AuthContextProvider>
      <ProfileContextProvider>
        <App/>
      </ProfileContextProvider>
    </AuthContextProvider>
  </AlertProvider>,
  document.getElementById("root")
);
