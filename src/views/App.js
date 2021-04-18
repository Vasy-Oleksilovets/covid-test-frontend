// @ts-nocheck
import React, {useContext, useEffect, useState} from 'react'

import Admin from "../layouts/Admin.js";
import Tester from "../layouts/Tester.js";
import TesterAuth from "../layouts/TesterAuth.js";
import AdminAuth from "../layouts/AdminAuth.js";
import AuthRoute from '../util/AuthRoute';

import jwtDecode from 'jwt-decode';

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// views without layouts

import Landing from "./Landing.js";
import Profile from "./Profile.js";
import WorkInForm from './WorkInForm.js'

import {AuthContext} from '../context/AuthContext';
let role = '';

const token = localStorage.getItem('userToken');
if(token){
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()){
    window.location.href = '/auth/login'
    role = "tester";
  }
  else {
    if(decodedToken.admin) role="admin";
    else role = "tester";
  }
}

export default function App() {
    const auth = useContext(AuthContext);
    useEffect(() => {

    }, [])
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/walk-in-form" component={WorkInForm} />
                    <AuthRoute path="/admin" authenticatied={role=="admin" || auth.isAuthenticated} component={Admin} />
                    <AuthRoute path="/tester" authenticatied={role=="tester" || auth.isAuthenticated} component={Tester} />
                    <Route path="/testerauth" component={TesterAuth} />
                    <Route path="/adminauth" component={AdminAuth} />
                    <Route path="/landing" exact component={Landing} />
                    <Route path="/profile" exact component={Profile} />
                    {/* <Route path="/" exact component={Index} /> */}
                    <Redirect from="*" to="/testerauth" />
                </Switch>
            </BrowserRouter>
        </div>
    )
}
