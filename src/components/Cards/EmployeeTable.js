// @ts-nocheck
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Server from '../../util/Server'

import {isEmpty, isEmail, isPhone, isZipCode} from '../../util/util';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import { select } from "@tailwindcss/custom-forms/src/defaultOptions";
 
export default function EmployeeTable({ color, selectedID, selectedBudget }) {
  const [showRemove, setShowRemove] = useState(false);
  const [patients, setPatients] = useState([]);
  const [budget, setBudget] = useState(0);
  const [unitPrice, setUnitPrice] = useState(125);
  let  [,setState]=useState();

  const { server } = Server();

  useEffect(() => {
    getEmployees();
  }, [selectedID])

  useEffect(() => {
    setUnitPrice(selectedBudget);
  }, [selectedBudget])

  const getEmployees = () => {
    if(!isEmpty(selectedID)){
      server.post('/patient/get-patients-with-company-id', {company_id: selectedID}).then((res) => {
        if(res.status === 200) {
          let tempPatients = res.data.patients;
          setPatients(tempPatients);
        }
      }).catch(err => {

      })
    }
  }

  const calculateBudget = () => {
    //calculate Budget
    let tempPatients = patients;
    let tempBudget = 0;
    for(let item of tempPatients){
      if(item.is_paid){
        tempBudget += unitPrice;
      }
    }
    setBudget(tempBudget);
  }

  const selectedPay = (param, index) => {
    let tempPatients = patients;
    tempPatients[index].is_paid = param;
    setPatients(tempPatients); 
    setState({});
  }
  
  const paidEmployee = () => {
    let paidEmployeeList = [];
    for(let i=0; i<patients.length; i++){
      if(patients[i].is_paid === true) {
        paidEmployeeList.push(patients[i]._id);
      }
    }

    setShowRemove(false);
  }

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-blue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 flex justify-between items-center">
              <div className={ "font-semibold text-lg " + (color === "light" ? "text-gray-800" : "text-white")}>Tested Employees</div>
              <div>
                
                <button onClick= {(e) => {
                  calculateBudget();
                  setShowRemove(true);
                }} className="bg-indigo-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  <i className="fas fa-user-plus mr-1"></i> CHARGE
                </button>
                
              </div>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  No
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Name
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Email
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Phone
                </th>
                <th
                  className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +(color === "light"? "bg-gray-100 text-gray-600 border-gray-200": "bg-blue-800 text-blue-300 border-blue-700")}>
                  Ignore
                </th>
              </tr>
            </thead>
            <tbody>     
              {patients.map((item, index) => (
                <tr role="button" key={index}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {index + 1}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.Pt_Fname} {item.Pt_Lname}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.Pt_Email}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {/* <i className="fas fa-circle text-green-500 mr-2"></i>{" "} */}
                  {item.Pt_Phone}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right flex">
                    <label className="inline-flex items-center">
                      <input type="checkbox" checked={item.is_paid} onChange = {(e) => {selectedPay(e.target.checked, index)}} className="form-checkbox h-5 w-5 text-orange-600"/>
                  </label>
                </td>
              </tr>
              ))}
              
            </tbody>
          </table>
        </div>
        <NotificationContainer/>
      </div>
      {showRemove? (
        <>
          <div className=" w-screen justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-3/4 sm:w-full my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between px-5 py-2 border-b border-solid border-gray-300 rounded-t">
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  >
                    <span onClick = {(e) => {setShowRemove(false)}} className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <i class="fas fa-times"></i>
                    </span>
                  </button>
                </div>
                {/*body*/}
                {patients.length !== 0 && budget !==0 ? <div className="relative px-6 py-1 flex-auto">
                  <div className="justify-center flex text-lg my-5">
                    You will get paid {budget}$ from this company?
                  </div>
                </div>: <div className="relative px-6 py-1 flex-auto">
                <div className="justify-center flex text-lg my-5">
                  Please select Employees.
                </div>
              </div>}
                
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                <button onClick = {(e) => {setShowRemove(false)}} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  Cancel
                </button>
                {patients.length !== 0 && budget !==0 ?
                <button onClick={(e) => {paidEmployee()}} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  Confirm
                </button> :
                <button onClick = {(e) => {setShowRemove(false)}}  className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                 Confirm
                </button>
              }
               
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

EmployeeTable.defaultProps = {
  color: "light",
};

EmployeeTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
