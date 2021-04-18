// @ts-nocheck
import React, {useState, useEffect} from "react";
import PatientTestsTable from "components/Cards/PatientTestsTable.js";
import PatientTable from "components/Cards/PatientTable.js";
import Server from '../../util/Server'

export default function Tests() {
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState('');
  const { server } = Server();
  const [openTab, setOpenTab] = React.useState(1);
  const color = 'orange';

  useEffect(() => {
    getLocations();
  }, [])

  const getLocations = () => {
    server.get('/testorganization/get-test-org').then((res) => {
      if(res.status === 200) {
        setLocations(res.data.testOrgs);
        if(res.data.testOrgs.length > 0){
          setLocationId(res.data.testOrgs[0]._id);
        }
      }
    }).catch(err => {
      console.error(err);    
    })
  }

  const changedLocation = (location_id) => {
    setLocationId(location_id);
  }

  return (
    <>
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row relative"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "border text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1
                    ? "text-white bg-" + color + "-600"
                    : "text-" + color + "-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                CURRENT TESTS
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "border text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2
                    ? "text-white bg-" + color + "-600"
                    : "text-" + color + "-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                historical tests
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <div className="relative w-1/2 px-4 max-w-full flex-grow flex-1 flex justify-between items-center">
                    <div className="font-semibold text-lg text-blue mr-2">Location:</div>
                    <div className="block w-full overflow-x-auto">
                      <select onChange={(e) => {changedLocation(e.target.value)}} style={{backgroundColor: '#3182ce'}} className="rounded shadow p-2 px-5 w-full text-white">
                        {locations.map(item => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <PatientTable admin={true} locationId={locationId}/>
                  </div>

                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  
                  <div className="relative w-1/2 px-4 max-w-full flex-grow flex-1 flex justify-between items-center">
                    <div className="font-semibold text-lg text-blue mr-2">Location:</div>
                    <div className="block w-full overflow-x-auto">
                      <select onChange={(e) => {changedLocation(e.target.value)}} style={{backgroundColor: '#3182ce'}} className="rounded shadow p-2 px-5 w-full text-white">
                        {locations.map(item => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <PatientTestsTable locationId={locationId}/>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

      


      <div className="flex flex-wrap mt-4">
      
        <div className="w-full mb-12 px-4">
        
        </div>
      </div>
    </>
  );
}