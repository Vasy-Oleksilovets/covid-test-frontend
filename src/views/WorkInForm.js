// @ts-nocheck
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
// components
import DatePicker from "react-datepicker";
import {isEmpty, isEmail, isPhone, isZipCode} from '../util/util';
import states from '../util/states.json'
import Server from  '../util/Server';
import { useAlert } from 'react-alert';
import queryString from 'query-string';
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_KEY);

export default function WorkInForm(){
    return (
        <div>
            <Elements stripe={stripePromise}>
                <Form />
            </Elements>
        </div>
    )
}

function Form() {
    const alert = useAlert()
    const { server } = Server();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [county, setCounty] = useState('');
    const [state, setState] = useState('');
    const [phone, setPhone] = useState('');
    const [sex, setSex] = useState('');
    const [race, setRace] = useState('');
    const [ethnicity, setEthnicity] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [streetAddressError, setStreetAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [zipCodeError, setZipCodeError] = useState('');
    const [CountyError, setCountyError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [sexError, setSexError] = useState('');
    const [raceError, setRaceError] = useState('');
    const [ethnicityError, setEthnicityError] = useState('');
    const [hiddenError, setHiddenError] = useState('');

    const [clientSecret, setClientSecret] = useState('');

    const [location, setLocation] = useState({}); //Information to show the location detail if the location id is included in the url
    const [testLocations, setTestLocations] = useState([]);
    const [locationId, setLocationId] = useState('');

    const stripe = useStripe();
    const elements = useElements();

    const [sexList, setSexList] = useState([
        'Male',
        'Female',
        'Other',
        'Unknown',
        'Ambiguous'
    ]);
    const [raceList, setRaceList] = useState([
        'American Indian or Alaskan Native',
        'Asian',
        'Black or African American',
        'Native Hawalian or Other Pacific islander',
        'White',
        'Other',
        'Unknown'
    ]);
    const [ethnicityList, setEthnicityList] = useState([
        'Hispanic',
        'Non-Hispanic',
        'Unknown'
    ]);

    useEffect(() => {
        //Get
        server.get('/payment/secret').then(res => {
            if(res.status === 200){
                setClientSecret(res.data.client_secret);
            }
        }).catch(err => {
            console.log(err);
        })

        //If there is testing location in the parameter, need to fetch the info about this location from backend.
        let paredQuery = queryString.parse(window.location.search);
        if(paredQuery.location_id !== undefined){
            let param = {
                locationID: paredQuery.location_id
            }
            server.post('/testorganization/get-detail-location', param).then((res) => {
                setLocation(res.data.location);
            }).then(err => {
                console.log(err);
            })
        }

        if (paredQuery.cares !== undefined) {
            server.get('/testorganization/get-test-org').then((res) => {
                if (res && res.data && res.data.testOrgs) {
                    setTestLocations(res.data.testOrgs);
                    if (res.data.testOrgs.length && !paredQuery.location_id) {
                        console.log(res.data.testOrgs[0]._id);
                        setLocationId(res.data.testOrgs[0]._id);
                    }
                }
            });
        }
        
    }, [])

    const sendRequest = (data) => {
        axios.post(`${process.env.REACT_APP_API_URL}/patient/save-patient`, data)
        .then(res => {
            alert.show('Information saved!', {
                timeout: 2000, // custom timeout just for this one alert
                type: 'success',
            })
            clearStates();
            setTimeout(() => {
                window.location.reload();
            }, 4000)
            
        }).catch(err => {
            console.log(err);
            alert.show('There was an error submitting your request.', {
                timeout: 2000, // custom timeout just for this one alert
                type: 'error',
            })
            
            setTimeout(() => {
                window.location.reload();
            }, 4000)
        })
    }

    const submitForm = async() => {
        let paredQuery = queryString.parse(window.location.search);
        if(validationCheck()){
            if(isEmpty(paredQuery.company_id) && isEmpty(paredQuery.cares)){
                if(!stripe || !elements){
                    return;
                }
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name
                        },
                    }
                });
                if(result.error){
                    alert.show('There is some error for the payment!', {
                        timeout: 2000, // custom timeout just for this one alert
                        type: 'error',
                    });
                }
                let tempId = paredQuery.location_id;
                if (locationId) {
                    tempId = locationId;
                }
                let data = {state, name, email, age, birthDate, streetAddress, city, zipCode, county, phone, sex, race, ethnicity, location_id:tempId, company_id: paredQuery.company_id, cares: paredQuery.cares, is_paid: true};
                sendRequest(data);
            } else {
                let tempId = paredQuery.location_id;
                if (locationId) {
                    tempId = locationId;
                }
                let data = {state, name, email, age, birthDate, streetAddress, city, zipCode, county, phone, sex, race, ethnicity, location_id:tempId, company_id: paredQuery.company_id, cares: paredQuery.cares, is_paid: false};
                sendRequest(data);
            }
            
            
        }
    }
    const validationCheck = () => {
        let paredQuery = queryString.parse(window.location.search);
        let flag = false;
        if(isEmpty(name)) {
            setNameError('Name cannot be empty.');
            flag = true
        }
        else {
            setNameError('');
        }
        if(isEmpty(email)){
            setEmailError('Email cannot be empty.');
            flag = true
        }
        else {
            setEmailError('');
        }
        if(!isEmail(email)){
            setEmailError('Email format is incorrect.');
            flag = true
        }
        else {
            setEmailError('');
        }
        if(isEmpty(age)){
            setAgeError('Age cannot be empty');
            flag = true
        }
        else {
            setAgeError('');
        }
        if(isEmpty(streetAddress)){
            setStreetAddressError('Street Address cannot be emtpy');
            flag = true
        }
        else {
            setStreetAddressError('');
        }
        if(isEmpty(city)){
            setCityError('City cannot be empty');
            flag = true;
        }
        else {
            setCityError('');
        }
        if(isEmpty(zipCode)){
            setZipCodeError('Zip Code cannot be empty');
            flag = true;
        }
        else {
            setZipCodeError('');
        }
        if(!isZipCode(zipCode)){
            setZipCodeError('Zip Code is not valid');
            flag = true;
        }
        if(isEmpty(county)){
            setCountyError('County cannot be empty');
            flag = true;
        }
        else {
            setCountyError('');
        }
        if(isEmpty(phone)){
            setPhoneError('Phone Number cannot be empty');
            flag = true;
        }
        else {
            setPhoneError('');
        }
        if(!isPhone(phone)) {
            setPhoneError('Phone number is invalid');
            flag = true;
        }
        else {
            setPhoneError('');
        }
        
        if(isEmpty(sex)){
            setSexError('Sex cannot be empty');
            flag = true;
        }
        else {
            setSexError('');
        }
        if(isEmpty(state)){
            setStateError('State cannot be empty');
            flag = true;
        }
        else {
            setStateError('');
        }
        if(isEmpty(race)){
            setRaceError('Race cannot be empty');
            flag = true;
        }
        else {
            setRaceError('');
        }
        if(isEmpty(ethnicity)){
            setEthnicityError('Ethnicity cannot be empty');
            flag = true;
        }
        else {
            setEthnicityError('');
        }
        if(isEmpty(paredQuery.location_id) && isEmpty(locationId)){
            setHiddenError('Hidden parameters are empty');
            flag = true;
        }
        else setHiddenError('');

        if(flag) return false;
        else return true;
    }

    const clearStates = () => {
        setName("");
        setEmail("");
        setAge("");
        setBirthDate(new Date());
        setStreetAddress('');
        setCity('');
        setZipCode('');
        setCounty('');
        setState('');
        setPhone('');
        setSex('');
        setRace('');
        setEthnicity('')
    }

    let hiddenParams = queryString.parse(window.location.search);

    return (
    <>
    <main>
        <section className="bg-gray-800">
            <div className="container mx-auto pt-8 sm:pt-16 px-4">
                <div className="flex justify-center">
                    <div className="w-full lg:w-6/12 px-4">
                        <div className="flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300">
                            <div className="flex-auto p-5 lg:p-10">
                                <h4 className="text-2xl font-semibold">Rx Rapid Testing</h4>
                                <div className="text-gray-600">
                                    <span className="text-red-600">* Required</span>
                                </div>


                                {/* If the location_id is included in the url, should show the location information to the user */}
                                {Object.keys(location).length > 0? 
                                    <div className="relative w-full mt-8">
                                        <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="full-name">Location <span className="text-red-600">*</span></label>
                                        <input
                                            value={location.name}
                                            type="text"
                                            className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-gray-400 rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                            placeholder="Full Name"
                                            disabled
                                        />
                                    </div>: null
                                }

                                {hiddenParams.cares && !hiddenParams.location_id ? <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">Location <span className="text-red-600">*</span></label>
                                    <select className="w-full p-3 rounded" onChange={(e) => {setLocationId(e.target.value)}}>
                                        {testLocations.map(item => (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div> : null}

                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="full-name">Name <span className="text-red-600">*</span></label>
                                    <input
                                        value={name}
                                        type="text"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                        placeholder="Full Name"
                                        onChange={(e) => {setName(e.target.value)}}
                                    />
                                </div>
                                {nameError? <div className="text-sm text-red-600">{nameError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="email">Email <span className="text-red-600">*</span></label>
                                    <input
                                        value={email}
                                        type="email"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                        placeholder="Email"
                                        onChange={(e) => {setEmail(e.target.value)}}
                                    />
                                </div>
                                {emailError? <div className="text-sm text-red-600">{emailError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="email">Date of Birth <span className="text-red-600">*</span></label>
                                    <DatePicker selected={birthDate} className="rounded w-full p-2" onChange={date => setBirthDate(date)} />
                                </div>
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="age">Age <span className="text-red-600">*</span></label>
                                    <input
                                        type="number"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                        placeholder="Age"
                                        onChange={(e) => {setAge(e.target.value)}}
                                        value={age}
                                    />
                                </div>
                                {ageError? <div className="text-sm text-red-600">{ageError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">Street Address <span className="text-red-600">*</span></label>
                                    <input
                                        type="text"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                        placeholder="Street Address"
                                        value={streetAddress}
                                        onChange={(e) => {setStreetAddress(e.target.value)}}
                                    />
                                </div>
                                {streetAddressError? <div className="text-sm text-red-600">{streetAddressError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">City <span className="text-red-600">*</span></label>
                                    <input
                                        value={city}
                                        type="text"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                        placeholder="City"
                                        onChange={(e) => {setCity(e.target.value)}}
                                    />
                                </div>
                                {cityError? <div className="text-sm text-red-600">{cityError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">Zip Code <span className="text-red-600">*</span></label>
                                    <input
                                        value={zipCode}
                                        type="text"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                        placeholder="Zip Code"
                                        onChange={(e) => {setZipCode(e.target.value)}}
                                    />
                                </div>
                                {zipCodeError? <div className="text-sm text-red-600">{zipCodeError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">County <span className="text-red-600">*</span></label>
                                    <input
                                        value={county}
                                        type="text"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                        placeholder="County"
                                        onChange={(e) => {setCounty(e.target.value)}}
                                    />
                                </div>

                                {zipCodeError? <div className="text-sm text-red-600">{CountyError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">State <span className="text-red-600">*</span></label>
                                    <select value={state} className="w-full p-3 rounded" onChange={(e) => {setState(e.target.value)}}>
                                        <option value="">Choose State</option>
                                        {Object.keys(states).map(item => (
                                            <option key={item} value={item}>{states[item]}</option>
                                        ))}
                                    </select>
                                </div>
                                {stateError? <div className="text-sm text-red-600">{stateError}</div>: null}

                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">Cell Phone Number <span className="text-red-600">*</span></label>
                                    <input
                                        value={phone}
                                        type="text"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                        placeholder="Cell Phone Number"
                                        onChange={(e) => {setPhone(e.target.value)}}
                                    />
                                </div>
                                {phoneError? <div className="text-sm text-red-600">{phoneError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">Sex <span className="text-red-600">*</span></label>
                                    {sexList.map((item, index) => (
                                        <div key={index}>
                                          <label><input name="sex" value={item} onChange={(e) => {setSex(e.target.value)}} type="radio"/></label> <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                {sexError? <div className="text-sm text-red-600">{sexError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">Race <span className="text-red-600">*</span></label>
                                    {raceList.map((item, index) => (
                                        <div key={index}>
                                          <label><input name="race" value={item} onChange={(e) => {setRace(e.target.value)}} type="radio"/></label> <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                {raceError? <div className="text-sm text-red-600">{raceError}</div>: null}
                                <div className="relative w-full mt-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">Ethnicity <span className="text-red-600">*</span></label>
                                    {ethnicityList.map((item, index) => (
                                        <div key={index}>
                                          <label><input name="ethnicity" value={item} onChange={(e) => {setEthnicity(e.target.value)}} type="radio"/></label> <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                {ethnicityError? <div className="text-sm text-red-600">{ethnicityError}</div>: null}
                                {!hiddenParams.company_id && !hiddenParams.cares ? <div className="relative w-full mt-3">
                                    <p className="block uppercase text-gray-700 text-s font-bold mb-2" htmlFor="streetAddress">Test Price: $125.00</p>
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2" htmlFor="streetAddress">Payment Information <span className="text-red-600">*</span></label>
                                   
                                    <CardElement options={{
                                    style: {
                                        base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#bac7d4',
                                        },
                                        },
                                        invalid: {
                                        color: '#9e2146',
                                        },
                                    },
                                    }}/>
                                </div> : null}
                                {hiddenError? <div className="text-sm text-red-600 mt-3">{hiddenError}</div>: null}
                                <div className="text-center mt-6">
                                    {hiddenParams.company_id || hiddenParams.cares ?
                                        <button
                                            onClick = {(e) => {submitForm()}}
                                            className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase w-full px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                        >
                                            Submit
                                        </button>:
                                        <button
                                            onClick = {(e) => {submitForm()}}
                                            className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase w-full px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            disabled={!stripe}
                                        >
                                            Submit and Pay $125
                                        </button>
                                    }
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    </>
  );
}

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <CardElement options={{
        style: {
            base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#bac7d4',
            },
            },
            invalid: {
            color: '#9e2146',
            },
        },
        }}/>
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    );
}
