import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
const AuthRoute = ({component:Component, authenticatied, ...rest}) => (
    <Route
    {...rest}
    render = {(props) => authenticatied===false? <Redirect to='/'/> : <Component {...props}/>}
    />
)

export default AuthRoute;