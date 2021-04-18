// @ts-nocheck
import React, {useEffect, useState, useContext} from "react";
import Server from '../../util/Server'
import { ProfileContext } from '../../context/ProfileContext';
import { useAlert } from 'react-alert';
import Moment from 'react-moment';
import NumberFormat from 'react-number-format';

// components
export default function PatientTable({admin, locationId}) {
  const alert = useAlert()
  const { server } = Server();
  const profile = useContext(ProfileContext);
  const [patients, setPatients] = useState([]);
  const [updatedPatients, setUpdatedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  let  [,setState]=useState();

  useEffect(() => {
    getPatients();
  }, [profile.userProfile, locationId])

  useEffect(() => { 
    setLoading(true);
  }, [])

  const getPatients = () => {
    if(Object.keys(profile.userProfile).length > 0){
      let data= {};
      if(admin)
        data = {
          location_id: locationId
        }
      else 
        data = {
          location_id: profile.userProfile.location_id
      }
      
      server.post('/patient/getpatients', data).then((res) => {
        setPatients(res.data.patients);
        setLoading(false);
      }).catch(err => {
        setLoading(false)
      })
    }
  }
  
  const setPositive = (index) => {
    let tempPatients = patients;
    tempPatients[index].Result = 1;
    setPatients(tempPatients);
    let temp = updatedPatients;
    let flag = false;
    for(let i=0; i<temp.length; i++){
      if(temp[i]._id === patients[index]._id){
        temp[i] = patients[index];
        flag = true;
      }
    }
    if(!flag) temp.push(patients[index]);
    setUpdatedPatients(temp);
    setState({});
  }

  const setNegative = (index) => {
    let tempPatients = patients;
    tempPatients[index].Result = 2;
    setPatients(tempPatients);
    let temp = updatedPatients;
    let flag = false;
    for(let i=0; i<temp.length; i++){
      if(temp[i]._id === patients[index]._id){
        temp[i] = patients[index];
        flag = true;
      }
    }
    if(!flag) temp.push(patients[index]);
    setUpdatedPatients(temp);
    setState({});
  }

  const savePatientResult = (e, spatient, index) => {
    if(spatient.Result === undefined || spatient.Result === 0){
      window.confirm('Please select the status of this patient.');
      return;
    }
    if(spatient.tester_name === ''){
      window.confirm('Please enter tester name.');
      return;
    }
    if(spatient.test_variant === ''){
      window.confirm('Please select the type of test.');
      return
    }
    const param = {
      patient: spatient
    }
    server.post('/patient/save-patient-result', param).then(res => {
      if(res.status === 200) {
        alert.show('Saved Successfully!', {
          timeout: 2000,
          type: 'success',
        });
        //Remove this item from the patients list
        let tempPatients = patients;
        tempPatients.splice(index, 1);
        setPatients(tempPatients);
        setState({});
      }
    }).catch(err => {
    })
  }

  const ignorePatient = (e, ignorePatient, index) => {
    if(window.confirm('Are you sure you want to ignore this patient?')){
      const param = {
        patient: ignorePatient
      }
      server.post('/patient/save-update-ignore', param).then(res => {
        if(res.status === 200) {
          alert.show('Saved Successfully!', {
            timeout: 2000,
            type: 'success',
          });
          //Remove this item from the patients list
          let tempPatients = patients;
          tempPatients.splice(index, 1);
          setPatients(tempPatients);
          setState({});
        }
      })
    }
    else console.log('cancelled');
  }

  const renderCheckMark = (patient, index) => {
    if(patient.Result === 0 || patient.Result === undefined) return (
      <div className="flex">
        <div className="bg-green-400 rounded" role="button" onClick={(e) => {setPositive(index)}} style={{width: '25px', height: '25px', opacity: '0.5'}}></div>
        <div className="bg-red-400 rounded" onClick={(e) => {setNegative(index)}} style={{width: '25px', height: '25px', opacity: '0.5'}}></div>
      </div>
    );
    else {
      if(patient.Result === 1) return (
      <div className="flex">
        <div className="bg-green-500 rounded" role="button" onClick={(e) => {setPositive(index)}} style={{width: '25px', height: '25px', opacity: '1'}}></div>
        <div className="bg-gray-400 rounded" role="button" onClick={(e) => {setNegative(index)}} style={{width: '25px', height: '25px', opacity: '0.5'}}></div>
      </div>)
      else return (
      <div className="flex">
        <div className="bg-gray-400 rounded" role="button" onClick={(e) => {setPositive(index)}} style={{width: '25px', height: '25px', opacity: '0.5'}}></div>
        <div className="bg-red-500 rounded" role="button" onClick={(e) => {setNegative(index)}} style={{width: '25px', height: '25px', opacity: '1'}}></div>
      </div>)
    }
  }
  return (
    <>
      {patients.length == 0 && !loading?
      <div className="flex justify-center text-2xl mt-24 text-bold text-gray-700">You have no tests to review, check back later!</div>:
      <div>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        {admin?null:
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-gray-800">
                Tests
              </h3>
            </div>
          </div>
        </div>
        }
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Name
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Email
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  PHONE NUMBER  
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  APPT DATE
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Test Admin Name
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  <span className="text-green-600">CareStart</span>/<span className="text-red-500">BD Veritor</span>
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  <span className="text-green-600">Positive</span>/<span className="text-red-500">Negative</span>
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  <th>Cash Collected</th>
                </th>
                <th className="px-6 bg-gray-300 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  <th>Action</th>
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index}>
                <th className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                  {patient.Pt_Fname} {patient.Pt_Lname}
                </th>
                <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {patient.Pt_Email}
                </td>
                <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <NumberFormat
                    format="(###) ###-####"
                    mask=""
                    value={patient.Pt_Phone}
                  />
                </td>
                <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <Moment format="YYYY-MM-DD hh:mm A">{patient.appointment_date? patient.appointment_date: patient.createdAt}</Moment>
                </td>
                <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <input type="text" value={patient.tester_name} onChange={(e) => {
                    patient.tester_name = e.target.value;
                    setState({});
                  }} placeholder="ENTER NAME" className="px-3 py-1 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"/>
                </td>
                <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <select className="px-3 py-1 placeholder-gray-400 rounded text-sm shadow outline-none" value={patient.test_variant} onChange = {(e) => {
                    patient.test_variant = e.target.value;
                    setState({});
                    }}>
                    <option value="">Select Test Variant</option>
                    <option value="CareStart">CareStart</option>
                    <option value="BD Veritor">BD Veritor</option>
                  </select>
                </td>
                <td className="border-t-0 px-3 al ign-middle border-l-0 border-r-0 text-ls whitespace-no-wrap px-4">
                    {renderCheckMark(patient, index)}
                </td>
                <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-ls whitespace-no-wrap px-4 text-center">
                  {patient.cash == 0 ? null: <input type="checkbox" class="form-checkbox h-5 w-5 text-orange-600" checked={patient.cash == 1 ? '' : true} />}
                </td>
                <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-ls whitespace-no-wrap px-4">
                  <button className="bg-green-500 text-white rounded px-4 py-1 shadow-lg mr-1 text-xs" onClick={(e) => {savePatientResult(e, patient, index)}}> <i className="fas fa-save mr-1"></i>Save</button>
                  <button className="bg-black text-white rounded px-4 py-1 shadow-lg text-xs" onClick={(e) => {ignorePatient(e, patient, index)}}>Ignore</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    }
    </>
  );
}
