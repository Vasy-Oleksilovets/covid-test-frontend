// @ts-nocheck
import React, {useState} from "react";

// components

import EmployeeTable from "components/Cards/EmployeeTable.js";
import CompanyProfile from "components/Cards/CompanyProfile.js";

export default function Settings() {

  const [selectedID, setSelectedID] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(125);
  let  [,setState]=useState();

  const setCompanyID = (company) => {
    setSelectedID(company);
  }

  //SEt the company object for the billing
  const setCompany = (company) => {
    setSelectedBudget(parseInt(company.unit_price));
    setState({});
  }

  return (
    <>
      <div>
        <div className="w-full">
          <EmployeeTable selectedBudget={selectedBudget} selectedID={selectedID}/>

        </div>
        <div className="w-full">
          <CompanyProfile  setCompanyID={setCompanyID} setCompany={setCompany}/>
        </div>
      </div>
    </>
  );
}
