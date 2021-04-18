// @ts-nocheck
import React, {useState, useEffect} from "react";
import {isEmpty, isEmail} from '../../util/util';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Server from '../../util/Server'

export default function Register() {
  const { server } = Server();
  const [name, setName] = useState('');
  const [email, setEamil] = useState('');
  const [orgId, setOrgID] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [orgError, setOrgError] = useState('');
  const [privacyError, setPrivacyError] = useState('');

  const [errormessage, setErrorMesssage] = useState(''); 

  const [isPrivacy, setIsPrivacy] = useState(false);
  const history = useHistory();

  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    server.get('/testorganization/get-test-org').then((res) => {
      setOrganizations(res.data.testOrgs);
    }).catch(err => {

    })
  },[])

  const validateForm = () => {
    let flag = true;
    if(isEmpty(name)) {
      setNameError('Name cannot be empty.');
      flag = false;
    }

    if(isEmpty(email)) {
      setEmailError('Email cannot be empty.');
      flag = false;
    }
    if(!isEmail(email)){
      setEmailError('Email format is incorrect.');
      flag = false;
    }
    if(isEmpty(password)){
      setPasswordError('Password cannot be empty.');
      flag = false;
    }
    if(isEmpty(orgId)){
      setOrgError('Test location cannot be empty');
      flag = false;
    }
    if(!isPrivacy){
      setPrivacyError('Please check this.');
      flag = false;
    }
    if(flag) return true;
    else return false;
  }

  const Signup = (e) => {
    e.preventDefault();
    if(validateForm() && isPrivacy){
      const data = {
        email,
        password,
        testername: name,
        org_id: orgId
      }
      axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, data)
      .then(res => {  
        history.push('/auth/login');
      }).catch(err => {
        setErrorMesssage(err.response.data.error);
        setNameError('');
        setPasswordError('');
        setEmailError('');
        setPrivacyError('');
      })
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-gray-600 text-sm font-bold">
                    Sign up with
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <button className="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150" type="button">
                    <img alt="..." className="w-5 mr-1" src={require("assets/img/github.svg")}/>Github
                  </button>
                  <button className="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150" type="button">
                    <img alt="..." className="w-5 mr-1" src={require("assets/img/google.svg")}/>Google
                  </button>
                </div>
                <hr className="mt-6 border-b-1 border-gray-400" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-gray-500 text-center mb-3 font-bold">
                  <small>Or sign up with credentials</small>
                </div>
                <form onSubmit = {Signup} meth>
                  <div className="relative w-full">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">Name</label>
                    <input onChange={(e) => {setName(e.target.value)}} type="text" className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150" placeholder="Name"/>
                  </div>
                  <div className="mb-3 text-sm text-red-400">{nameError}</div>

                  <div className="relative w-full">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">Email</label>
                    <input onChange={(e) => {setEamil(e.target.value)}} type="email" className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"placeholder="Email"/>
                  </div>
                  <div className="mb-3 text-sm text-red-400">{emailError}</div>
                  <div className="relative w-full">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">Location</label>
                    <select onChange={(e) => {setOrgID(e.target.value)}} className="w-full p-3 rounded">
                      <option value="">Select you test location</option>
                      {organizations.map((org) => (
                        <option value={org._id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3 text-sm text-red-400">{orgError}</div>

                  <div className="relative w-full">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">Password</label>
                    <input onChange={(e) => {setPassword(e.target.value)}} type="password" className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150" placeholder="Password"/>
                  </div>
                  <div className="mb-3 text-sm text-red-400">{passwordError}</div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input id="customCheckLogin" type="checkbox" onChange={(e) => {setIsPrivacy(e.target.checked)}} className="form-checkbox text-gray-800 ml-1 w-5 h-5 ease-linear transition-all duration-150"/>
                      <span className="ml-2 text-sm font-semibold text-gray-700">
                        I agree with the{" "}
                        <a href="#pablo" className="text-blue-500" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                  <div className="mb-3 text-sm text-red-400">{privacyError}</div>
                  <div className="mb-3 text-sm text-red-400">{errormessage}</div>
                  <div className="text-center mt-6">
                    <button className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150" type="submit">
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
