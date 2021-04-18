// @ts-nocheck
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Server from '../../util/Server'

import {isEmpty, isEmail, isPhone, isZipCode} from '../../util/util';

import {NotificationContainer, NotificationManager} from 'react-notifications';
 
export default function FranchiseTable({ color, selectedID }) {
  const [showModal, setShowModal] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEamil] = useState('');
  const [isCreate, setIsCreate] = useState(true);
  const [franchises, setFranchises] = useState([]);

  const [editFranchiseID, setEditFranchiseID] = useState('');

  const { server } = Server();

  const [nameError, setNameError] = useState('');
  const [contactNameError, setContactNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    getFranchises();
  }, [selectedID])

  const getFranchises = () => {
    if(!isEmpty(selectedID)){
      server.post('/franchise/get-franchises', {company_id: selectedID}).then((res) => {
        if(res.status === 200) {
          setFranchises(res.data.franchises);
        }
      }).catch(err => {

      })
    }
  }
  const createFranchise = () => {
    if(validationCheck()){
      const data = {
        company_id: selectedID,
        email,
        name,
        contactname: contactName,
      }
       server.post('/franchise/create-franchise', data).then((res) => {
        if(res.status === 200) {
          NotificationManager.info('Saved Successully!');
          setShowModal(false);
          resetForm();
          getFranchises();
        }
      }).catch(err => {
        NotificationManager.error('There is error when save it');
      })
    }
  }

  const resetForm = () => {
    setName('');
    setContactName('');
    setEamil('');
  }

  const validationCheck = () => {
    let flag = false;
    if(isEmpty(name)) {
      setNameError("Name cannot be empty.");
      flag = true;
    }
    if(isEmpty(contactName)){
      setContactNameError('Contact Name cannot be empty');
      flag = true;
    }
    if(isEmpty(email)){
      setEmailError('Email cannot be empty');
      flag = true;
    }
    if(isEmpty(contactName)){
      setContactNameError('Contact Name cannot be empty');
      flag = true;
    }
    if(!isEmail(email)) {
      setEmailError('Email is incorrect');
      flag = true;
    }
    if(flag) return false;
    else return true;
    
  }

  const setVariable = (item) => {
    setEditFranchiseID(item._id);
    setName(item.name);
    setContactName(item.contact_name);
    setEamil(item.email);
  }

  const editFranchise = (item) => {
    if(validationCheck()){
      const data = {
        id: editFranchiseID,
        email,
        name,
        contactname: contactName,
      }
       server.post('/franchise/update-franchise', data).then((res) => {
        if(res.status === 200) {
          NotificationManager.info('Updated Successully!');
          setShowModal(false);
          resetForm();
          getFranchises();
        }
      }).catch(err => {
        NotificationManager.error('There is error when save it');
      })
    }
  }

  const deleteFranchise = () => {
    if(!isEmpty(editFranchiseID)){
      const data = {
        id: editFranchiseID,
      }
       server.post('/franchise/delete-franchise', data).then((res) => {
        if(res.status === 200) {
          NotificationManager.info('Deleted Successully!');
          setShowRemove(false);
          resetForm();
          getFranchises();
        }
      }).catch(err => {
        NotificationManager.error('There is error when delete it');
      })
    }
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
              <div className={ "font-semibold text-lg " + (color === "light" ? "text-gray-800" : "text-white")}>Franchise</div>
              <div>
                <button onClick= {(e) => {
                  setShowModal(true);
                  setIsCreate(true);
                }} className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  <i className="fas fa-user-plus mr-1"></i> Create Franchise
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
                  Name
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Contact Name
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Contact Email
                </th>
                <th
                  className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +(color === "light"? "bg-gray-100 text-gray-600 border-gray-200": "bg-blue-800 text-blue-300 border-blue-700")}>
                  Action
                </th>

              </tr>
            </thead>
            <tbody>     
              {franchises.map((item, index) => (
                <tr role="button" key={index}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.name}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.contact_name}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {/* <i className="fas fa-circle text-green-500 mr-2"></i>{" "} */}
                  {item.email}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right flex">
                  <i role="button" onClick={(e) => {
                    setVariable(item);
                    setShowModal(true);
                    setIsCreate(false);
                  }} style={{fontSize: '16px'}} className="fas fa-edit text-green-400"></i>
                  <i onClick={(e) => {
                    setShowRemove(true);
                    setEditFranchiseID(item._id);
                  }} className="fas fa-trash-alt text-green-400 ml-2" style={{fontSize: '16px'}} role="button"></i>
                </td>
              </tr>
              ))}
              
            </tbody>
          </table>
        </div>
        <NotificationContainer/>
      </div>
      {showModal==1 ? (
        <>
          <div className=" w-screen justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-3/4 sm:w-full my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between px-5 py-2 border-b border-solid border-gray-300 rounded-t">
                  {isCreate?<h4 className="text-xl font-semibold">
                    Create Franchise
                  </h4>:
                  <h4 className="text-xl font-semibold">
                    Edit Franchise
                  </h4>
                  }
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span onClick = {(e) => {setShowModal(false)}} className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      �
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative px-6 py-1 flex-auto">
 
                  <div className="w-full flex mb-2">
                    <div className="w-1/2 mr-2">
                      <input type="text" value={name} onChange={(e) => {setName(e.target.value)}} placeholder="Franchise Name" className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:shadow-outline w-full"/>
                    </div>
                    <div className="w-1/2">
                      <input type="text" value={contactName} onChange={(e) => {setContactName(e.target.value)}} placeholder="Contact Name" className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:shadow-outline w-full"/>
                    </div>
                  </div>
                  <div className="w-full flex">
                    <div className="w-1/2 mr-2">
                      <input type="text" value={email} onChange={(e) => {setEamil(e.target.value)}}  placeholder="Franchise Email" className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:shadow-outline w-full"/>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                <button  onClick={() => setShowModal(false)} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  Cancel
                </button>
                {isCreate?
                <button onClick={createFranchise} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                 Create
                </button>:
                <button onClick={editFranchise} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                 Edit
                </button> 
                }
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
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
                    onClick={() => setShowModal(false)}
                  >
                    <span onClick = {(e) => {setShowRemove(false)}} className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      �
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative px-6 py-1 flex-auto">
                  <div className="justify-center flex text-lg my-5">
                    Are you sure you want to delete this company??
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                <button  onClick={() => setShowModal(false)} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  Cancel
                </button>
                <button onClick={deleteFranchise} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  Delete
                </button> 
               
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

FranchiseTable.defaultProps = {
  color: "light",
};

FranchiseTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
