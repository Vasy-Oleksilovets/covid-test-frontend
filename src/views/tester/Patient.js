// @ts-nocheck
import React from "react";

// components
import PatientTable from "components/Cards/PatientTable.js";;

export default function Patient() {
  return (
    <>
      {/* <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardLineChart />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart />
        </div>
      </div> */}
      <div className="flex flex-wrap mt-4">
        <div className="w-full px-4">
          <PatientTable />
        </div>
        {/* <div className="w-full xl:w-4/12 px-4">
        <CardSocialTraffic />
        </div> */}
      </div>
    </>
  );
}
