// @ts-nocheck
import React, {useState, useEffect, useContext} from "react";
import PropTypes from "prop-types";
import Server from '../../util/Server'

import {isEmpty, isEmail, isPhone, isZipCode} from '../../util/util';
import { ProfileContext } from '../../context/ProfileContext';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import NumberFormat from 'react-number-format';
 
import Moment from 'react-moment';

export default function PatientTestsTable({ color, locationId }) {
  const [tests, setTests] = useState([]);
  const { server } = Server();
  const [activeIndex, setActiveIndex] = useState(false);
  const profile = useContext(ProfileContext);

  useEffect(() => {
    if(locationId){ 
      getTests();
    }
  }, [profile.userProfile, locationId])

  const getTests = () => {
    const data = {
      location_id: locationId
    }
    server.post('/patient/get-patients-with-result', {...data}).then((res) => {
      if(res.status === 200) {
        setTests(res.data.patients);
      }
    }).catch(err => {
      console.error(err)
    })
  }

  const renderCheckMark = (item, index) => {
    if(item.Result === 1) return (
      <div className="flex">
        <i className="fas fa-2x fa-check text-green-500"></i>
      </div>)
      else return (
      <div className="flex">
        <i class="fas fa-times fa-2x text-red-500"></i>
      </div>
    )
  }

  return (
    <>
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow rounded " + (color === "light" ? "bg-white" : "bg-blue-900 text-white")}>
       
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-300 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Name
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-300 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Email
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-300 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  PHONE NUMBER  
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-300 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  APPT DATE
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  <span className="text-green-600">CareStart</span>/<span className="text-red-500">BD Veritor</span>
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-300 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Test admin name
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-300 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  <span className="text-green-600">Positive</span>/<span className="text-red-500">Negative</span>
                </th>
              </tr>
            </thead>
            <tbody>     
              {tests.map((item, index) => (
              <tr>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.Pt_Fname} {item.Pt_Lname}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.Pt_Email}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <NumberFormat
                    format="(###) ###-####"
                    mask=""
                    disabled
                    className="text-black"
                    value={item.Pt_Phone}
                  />
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <Moment format="YYYY-MM-DD hh:mm A">{item.createdAt}</Moment>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.test_variant}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.tester_name}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {renderCheckMark(item, index)}
                </td>
              </tr>
              ))}
              
            </tbody>
          </table>
        </div>
        <NotificationContainer/>
      </div>
    </>
  );
}

PatientTestsTable.defaultProps = {
  color: "light",
};

PatientTestsTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
