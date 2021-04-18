// @ts-nocheck
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Server from '../../util/Server'

import {isEmpty, isEmail} from '../../util/util';
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import {NotificationContainer, NotificationManager} from 'react-notifications';
 
export default function CompanyTable({ color, setCompanyID, tempCompany }) {
  const [showModal, setShowModal] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEamil] = useState('');
  const [stripe, setStripe] = useState('');
  const [isCreate, setIsCreate] = useState(true);
  const [companies, setCompanies] = useState([]);

  const [editCompanyID, setEditCompanyID] = useState('');

  const { server } = Server();

  const [nameError, setNameError] = useState('');
  const [contactNameError, setContactNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [stripeError, setStripeError] = useState('');
  let  [,setState]=useState();

  const [activeIndex, setActiveIndex] = useState(false);
  const [company, setCompany] = useState({});

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_KEY);

  useEffect(() => {
    getCompanies();
  }, [])

  useEffect(() => {
    if(Object.keys(tempCompany).length){
      let temp = companies;
      for(let i=0; i<temp.length; i++){
        if(temp[i]._id === tempCompany._id)
          temp[i] = tempCompany;
      }
      setState({})
    }
    getCompanies();
  }, [tempCompany])

  const getCompanies = () => {
    server.get('/company/get-companies').then((res) => {
      if(res.status === 200) {
        setCompanies(res.data.companies);
        //If there are some companies, set the first company as default
        if(res.data.companies.length > 0){
          setCompanyID(res.data.companies[0]);
        }
      }
    }).catch(err => {
      console.error(err);
    })
  }

  const createCompany = () => {
    if(validationCheck()){
      const data = {
        email,
        name,
        contactname: contactName
      }
      if(stripe) data.stripeID = stripe;
       server.post('/company/create-company', data).then((res) => {
        if(res.status === 200) {
          NotificationManager.info('Saved Successully!');
          setShowModal(false);
          resetForm();
          getCompanies();
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
    setStripe('');
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
    setEditCompanyID(item._id);
    setName(item.name);
    setContactName(item.contact_name);
    setEamil(item.email);
    setStripe(item.stripe_customer_id);
  }

  const editCompany = (item) => {
    if(validationCheck()){
      const data = {
        id: editCompanyID,
        email,
        name,
        contactname: contactName,
        stripeID: stripe
      }
       server.post('/company/update-company', data).then((res) => {
        if(res.status === 200) {
          NotificationManager.info('Updated Successully!');
          setShowModal(false);
          resetForm();
          getCompanies();
        }
      }).catch(err => {
        NotificationManager.error('There is error when save it');
      })
    }
  }

  const deleteCompany = () => {
    if(!isEmpty(editCompanyID)){
      const data = {
        id: editCompanyID,
      }
       server.post('/company/delete-company', data).then((res) => {
        if(res.status === 200) {
          NotificationManager.info('Deleted Successully!');
          setShowRemove(false);
          resetForm();
          getCompanies();
        }
      }).catch(err => {
        NotificationManager.error('There is error when delete it');
      })
    }
  }

  const changeActiveIndex = (activeNum) => {
    setActiveIndex(activeNum);
  };

  const createCustomer = (e) => {
    server.post('/company/create-customer', {email: company.email, name:company.name, companyId: company._id}).then((res) => {
      if(res.status === 200) {
        console.log(res);
        
        setCompany({...company, stripe_customer_id: res.data.customer_id});
        setStripe(res.data.customer_id);
        // setTempCompany({...company, stripe_customer_id: res.data.customer_id});
        setState({});
      }
    }).catch(err => {
      console.error(err);
    })
  }

  return (
    <>
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-blue-900 text-white")}>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 flex justify-between items-center">
              <div className={ "font-semibold text-lg " + (color === "light" ? "text-gray-800" : "text-white")}>Companies</div>
              <div>
                <button onClick= {(e) => {
                  setShowModal(true);
                  setIsCreate(true);
                }} className="bg-green-500 text-white active:bg-green-300 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  <i className="fas fa-user-plus mr-1"></i> Create Company
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
                  Company Name
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Contact Name
                </th>
                <th className={ "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " + (color === "light" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-blue-800 text-blue-300 border-blue-700")}>
                  Contact Email
                </th>
                <th
                  className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +(color === "light"? "bg-gray-100 text-gray-600 border-gray-200": "bg-blue-800 text-blue-300 border-blue-700")}>
                  Stripe Customer ID
                </th>
                <th style={{display: 'none'}}
                  className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +(color === "light"? "bg-gray-100 text-gray-600 border-gray-200": "bg-blue-800 text-blue-300 border-blue-700")}>
                  # Tested
                </th>
                <th
                  className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +(color === "light"? "bg-gray-100 text-gray-600 border-gray-200": "bg-blue-800 text-blue-300 border-blue-700")}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>     
              {companies.map((item, index) => (
                <tr onClick={(e) => {setCompanyID(item); changeActiveIndex(index); setCompany(item);}} role="button" key={index} className={activeIndex == index ? 'bg-blue-500': null}>
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
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.stripe_customer_id}
                </td>
                <td style={{display: 'none'}} className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  20
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right flex">
                  <i role="button" onClick={(e) => {
                    setVariable(item);
                    setShowModal(true);
                    setIsCreate(false);
                  }} style={{fontSize: '16px'}} className="fas fa-edit text-green-400"></i>
                  <i onClick={(e) => {
                    setShowRemove(true);
                    setEditCompanyID(item._id);
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
          <div className=" w-screen justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-3/4 sm:w-full my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between px-5 py-2 border-b border-solid border-gray-300 rounded-t">
                  {isCreate?<h4 className="text-xl font-semibold">
                    Create Company
                  </h4>:
                  <h4 className="text-xl font-semibold">
                    Edit Company
                  </h4>
                  }
                  <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => setShowModal(false)}>
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative px-6 py-1 flex-auto">
                  <div className="w-full flex mb-2">
                    <div className="w-1/2 mr-2">
                      <input type="text" value={name} onChange={(e) => {setName(e.target.value)}} placeholder="Company Name" className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:shadow-outline w-full"/>
                    </div>
                    <div className="w-1/2">
                      <input type="text" value={contactName} onChange={(e) => {setContactName(e.target.value)}} placeholder="Contact Name" className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:shadow-outline w-full"/>
                    </div>
                  </div>
                  <div className="w-full flex">
                    <div className="w-1/2 mr-2">
                      <input type="text" value={email} onChange={(e) => {setEamil(e.target.value)}}  placeholder="Company Email" className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:shadow-outline w-full"/>
                    </div>
                    <div className="w-1/2">
                      <input type="text" value={stripe} onChange={(e) => {setStripe(e.target.value)}}  placeholder="Stripe Customer ID" className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:shadow-outline w-full"/>
                    </div>
                  </div>
                </div>
                
                {/* Payment Modal */}
                {isCreate?
                  null:
                  <div className="relative px-6 py-1 flex-auto mt-3">
                    {company.stripe_customer_id===""?
                    <div className="relative px-6 py-1 flex-auto">
                      <button onClick={createCustomer} type="submit" className="w-full mt-5 bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-base px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" style={{transition: 'all .15s ease'}}>
                        Create Customer
                      </button>
                    </div>: null
                    }
                    {company.stripe_customer_id!==""?
                    <div className="relative px-6 py-1 flex-auto">
                      <Elements stripe={stripePromise}>
                        <CheckoutForm company={company}/>
                      </Elements>
                    </div>: null  
                    }
                  </div>
                }
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                <button  onClick={() => setShowModal(false)} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  Cancel
                </button>
                {isCreate?
                <button onClick={createCompany} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                 Create
                </button>:
                <button onClick={editCompany} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                 Save
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
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative px-6 py-1 flex-auto">
                  <div className="justify-center flex text-lg my-5">
                    Are sure you want to delete this company?
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                <button  onClick={() => setShowModal(false)} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
                  Cancel
                </button>
                <button onClick={deleteCompany} className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" type="button" style={{transition: "all .15s ease"}}>
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

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#000',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '18px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {color: '#fce883'},
      '::placeholder': {color: '#87bbfd'},
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee',
    },
  },
};

const CheckoutForm = ({company}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { server } = Server();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    if (error) {
      console.log('[error]', error);
    } else {
      //Successfully paymentmethod is created, need to attach a payment method to a customer
      console.log('[PaymentMethod]', paymentMethod);
      server.post('/company/attach-payment-method', {paymentMethod_id: paymentMethod.id, customer_id: company.stripe_customer_id}).then(res => {
        if(res.status === 200){
          NotificationManager.info('Payment method successfully attached.');
        }
      })
    }
  };
  return (
    <form className="m-auto pt-5" onSubmit={handleSubmit}>
      <CardElement options={CARD_OPTIONS}/>
      <button type="submit" disabled={!stripe} className="w-full mt-5 bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-base px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1" style={{transition: 'all .15s ease'}}>
        Add Payment Method
      </button>
    </form>
  );
};

CompanyTable.defaultProps = {
  color: "light",
};

CompanyTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
