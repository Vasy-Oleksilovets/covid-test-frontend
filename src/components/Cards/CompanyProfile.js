// @ts-nocheck
import React, {useState, useEffect} from "react";
import Server from '../../util/Server'
// components

export default function CompanyProfile({setCompanyID, setCompany}) {
  const [companies, setCompanies] = useState([]);
  const [companyID, setCompanyIDL] = useState('');
  const { server } = Server();
  let  [,setState]=useState();

  useEffect(() => {
    getCompanies();
  }, [])

  const getCompanies = () => {
    server.get('/company/get-companies').then((res) => {
      if(res.status === 200) {
        setCompanies(res.data.companies);
        if(res.data.companies.length > 0){
          setCompanyIDL(res.data.companies[0]._id);
          setCompanyID(res.data.companies[0]._id);
          setCompany(res.data.companies[0]);
        }
      }
    }).catch(err => {
      console.error(err);
    })
  }

  const renderStripeKey = () => {
    return companies.map(company => {
      if(company._id === companyID) return <span key={company._id}>{company.stripe_customer_id}</span>
      else return null;
    })
  }

  const renderPrice = () => {
    return companies.map((company, index) => {
      if(company._id === companyID) return (
        <div key={company._id}>
          <span className="mr-2">$</span><input className="border border-gray-400 px-3 py-2 rounded" style={{width: '58px'}} onChange={(e) => {changeUnitPrice(e.target.value, index)}} value={company.unit_price}/>
        </div>
      )
      else return null;
    })
  }

  //change the unit per test for company but it is not saved to the database
  const changeUnitPrice = (price, index) => {
    let tempcompanies = companies;
    tempcompanies[index].unit_price = price;
    setState({});
    setCompany(tempcompanies[index]);
  }

  const setCustomForIDL = (index) => {
    setCompanyIDL(companies[index]._id); 
    setCompanyID(companies[index]._id)
    setCompany(companies[index]);
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow rounded-lg mt-16">
        <div className="px-6">
          <div className="text-center mt-8 mb-4">
            <div className="flex justify-center items-center">
              <div className="mr-4 pt-3">
                <select style={{width: '200px'}} onChange = {(e) => {
                  setCustomForIDL(e.target.value);  
                }} className="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm border border-gray-400">
                  {companies.map((item, index) => (
                    <option value={index} key={item._id}>{item.name}</option>
                  ))}
                </select>
                <div className="text-sm text-gray-500">Select Company</div>
              </div>
              <div className="mr-6 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                  {renderPrice()}
                </span>
                <span className="text-sm text-gray-500">Price</span>
              </div>
            </div>
            <div className="w-full px-4 text-center mt-1">
            </div>
              {companyID?
                <div className="mb-4 text-gray-700">
                  <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
                  Stripe Customer ID: 
                  {renderStripeKey()}
                </div>: null
              }
            </div>
          </div>
        </div>
    </>
  );
}
