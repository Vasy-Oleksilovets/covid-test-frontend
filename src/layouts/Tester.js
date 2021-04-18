import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import TesterNavbar from "components/Navbars/TesterNavbar.js";
import TesterSidebar from "components/Sidebar/TesterSidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";

// views

import Patient from "views/tester/Patient.js";

export default function Tester() {
  return (
    <>
      <TesterSidebar />
      <div className="relative md:ml-64">
        <TesterNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/tester/patients" exact component={Patient} />
            <Redirect from="/tester" to="/tester/patients" />
          </Switch>
        </div>
      </div>
    </>
  );
}
