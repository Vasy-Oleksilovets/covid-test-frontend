// @ts-nocheck
import React, {useState} from "react";

// components
import CompanyTable from "components/Cards/CompanyTable.js";
import FranchiseTable from "components/Cards/FranchiseTable.js";
import Server from '../../util/Server'

import {NotificationContainer, NotificationManager} from 'react-notifications';

export default function Company() {
  const [selectedID, setSelectedID] = useState('');
  const [company, setCompany] = useState({});
  const [tempCompany, setTempCompany] = useState({});
  const { server } = Server();
  let  [,setState]=useState();
  const setCompanyID = (company) => {
    setSelectedID(company._id);
    setCompany(company);
  }
  //If the company doens't have customer id, will create the customer
  const createCustomer = (e) => {
    server.post('/company/create-customer', {email: company.email, name:company.name, companyId: company._id}).then((res) => {
      if(res.status === 200) {
        console.log(res);
        NotificationManager.info('Customer created successfully.');
        setCompany({...company, stripe_customer_id: res.data.customer_id});
        setTempCompany({...company, stripe_customer_id: res.data.customer_id});
        setState({});
      }
    }).catch(err => {
      console.error(err);
    })
  }

  return (
    <>
      {selectedID?  
      <div className="flex-wrap mt-4">
        <div className="w-fullpx-4">
          <CompanyTable tempCompany={tempCompany} setCompanyID={setCompanyID} color="dark"/>
        </div>
        <div className="w-fullpx-4">
          <FranchiseTable selectedID={selectedID}/>
        </div>
      </div>:
      <div className="flex flex-wrap mt-4">
       <div className="w-full px-4">
         <CompanyTable tempCompany={tempCompany} setCompanyID={setCompanyID} color="dark"/>
       </div>
      </div>
      }
      <NotificationContainer/>
    </>
  );
}
