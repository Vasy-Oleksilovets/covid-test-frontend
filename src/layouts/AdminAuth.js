// @ts-nocheck
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import FooterSmall from "components/Footers/FooterSmall.js";

// views

import Login from "views/adminauth/Login.js";
import Register from "views/adminauth/Register.js";
// import IndexNavbar from "components/Navbars/IndexNavbar.js";
export default function Auth() {
  return (
    <>
      <main>
        <section className="relative w-full h-full py-50 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-gray-900 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" + require("assets/img/register_bg_2.png") + ")",
            }}
          ></div>
          <Switch>
            <Route path="/adminauth/login" exact component={Login} />
            <Route path="/adminauth/register" exact component={Register} />
            <Redirect from="/adminauth" to="/adminauth/login" />
          </Switch>
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
