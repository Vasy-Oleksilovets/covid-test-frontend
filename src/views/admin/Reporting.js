import React, { useEffect, useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Server from '../../util/Server'

export default function Reporting() {
    const { server } = Server();
    const [ aptmCount, setAptmCount ] = useState(0);
    const [ revenue, setRevenue ] = useState(0);
    const [locations, setLocations] = useState([]);
    const [locationId, setLocationId] = useState('');
    useEffect(() => {
        getAptmCount();
        getRevenue();
    }, [locationId])
    useEffect(() => {
        getLocations();
    }, [])
    const getAptmCount = () => {
        server.post('/patient/appointments-count', {
            location_id: locationId
        })
        .then(res => {
            console.log("appoints count", res);
            setAptmCount(res.data.count);
        }).catch(err => {
            console.error(err);    
        })
    }
    const getRevenue = () => {
        server.post('/patient/revenue', {
            location_id: locationId
        })
        .then(res => {
            setRevenue(res.data.revenue);
        }).catch(err => {
            console.error(err);    
        })
    }
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
    const dataForAptm = [
        {
          name: 'Appointments Count',
          count: aptmCount,
          amt: 100,
        }
    ];
    const dataForRevenue = [
        {
          name: 'Revenue',
          revenue: revenue,
          amt: 100,
        }
    ];
    return (
        <>
            <div className="relative w-1/2 px-4 max-w-full flex-grow flex-1 flex justify-between items-center location-select-on-reporting" style={{paddingRight: 0}}>
                <div className="font-semibold text-lg text-blue mr-2">Location:</div>
                <div className="block w-full overflow-x-auto">
                    <select onChange={(e) => {changedLocation(e.target.value)}} style={{backgroundColor: 'rgb(85 144 167)'}} className="rounded shadow p-2 px-5 w-full text-white">
                    {locations.map(item => (
                        <option value={item._id}>{item.name}</option>
                    ))}
                    </select>
                </div>
            </div>
            <ResponsiveContainer className="appointment-count-graph" width="10%" height="100%">
                <BarChart
                width={100}
                height={300}
                data={dataForAptm}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" stackId="a" fill="#8884d8" />
                {/* <Bar dataKey="uv" stackId="a" fill="#82ca9d" /> */}
                </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer className="revenue-graph" width="10%" height="100%">
                <BarChart
                width={100}
                height={300}
                data={dataForRevenue}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" stackId="a" fill="#82ca9d" />
                {/* <Bar dataKey="uv" stackId="a" fill="#82ca9d" /> */}
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}