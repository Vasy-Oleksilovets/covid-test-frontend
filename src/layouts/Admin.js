// @ts-nocheck
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminHeaderStats from "components/Headers/AdminHeaderStates.js";

// views

import Company from "views/admin/Company.js";
import Maps from "views/admin/Maps.js";
import Billing from "views/admin/Billing.js";
import Tests from "views/admin/Tests.js";
import Reporting from "views/admin/Reporting.js";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64">
        <AdminNavbar />
        {/* Header */}
        <AdminHeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/company" exact component={Company} />
            <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/billing" exact component={Billing} />
            <Route path="/admin/tests" exact component={Tests} />
            <Route path="/admin/reporting" exact component={Reporting} />
            <Redirect from="/admin" to="/admin/company" />
          </Switch>
          {/* <FooterAdmin /> */}
        </div>
      </div>
    </>
  );
}
