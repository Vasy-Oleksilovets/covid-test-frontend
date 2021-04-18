// @ts-nocheck
import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import {isEmpty, isEmail} from '../../util/util';
import {AuthContext} from '../../context/AuthContext';
import {ProfileContext} from '../../context/ProfileContext';
import jwtDecode from 'jwt-decode';
import { useHistory } from "react-router-dom";

export default function Login() {
  const auth = useContext(AuthContext);
  const profile = useContext(ProfileContext);
  const [email, setEamil] = useState('');
  const [password, setPassword] = useState('');
  const [isremember, setIsRemember] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errormessage, setErrorMesssage] = useState(''); 

  const history = useHistory();

  const Login = (e) => {
    e.preventDefault();
    if(validateForm()){
      const data = {
        email,
        password
      }
      axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, data)
      .then(res => {  
        auth.login();
        const token = res.data.token;
        localStorage.setItem('userToken', token);
        if(token){
          const decodedToken = jwtDecode(token);
          profile.setProfile(decodedToken);
        }
        history.push('/tester');
      }).catch(err => {
        if(err.response !== undefined) setErrorMesssage(err.response.data.error);
      })
    }
  }

  const validateForm = () => {
    let flag = true;
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
    if(flag) return true;
    else return false;
  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-gray-600 text-sm font-bold">
                    Test Administrator Panel
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-gray-400" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit = {Login}>
                  <div className="relative w-full">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">Email</label>
                    <input onChange={(e) => {setEamil(e.target.value)}} type="email" className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150" placeholder="Email"/>
                  </div>
                  <div className="mb-3 text-sm text-red-400">{emailError}</div>
                  <div className="relative w-full">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">Password</label>
                    <input onChange={(e) => {setPassword(e.target.value)}} type="password" className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150" placeholder="Password"/>
                  </div>
                  <div className="mb-3 text-sm text-red-400">{passwordError}</div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox text-gray-800 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        onChange={(e) => {setIsRemember(e.target.checked)}}
                      />
                      <span className="ml-2 text-sm font-semibold text-gray-700">
                        Remember me
                      </span>
                    </label>
                  </div>
                  <div className="mb-3 text-sm text-red-400 flex justify-center">{errormessage}</div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-300"
                >
                  <small>Forgot password?</small>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
