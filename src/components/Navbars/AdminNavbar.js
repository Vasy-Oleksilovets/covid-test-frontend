// @ts-nocheck
import React from "react";
import { useHistory } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Navbar() {
  const history = useHistory();
  const logout = () => {
    localStorage.clear();
    history.push('/')
  }
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
          <a className="text-white text-sm uppercase hidden lg:inline-block font-semibold" href="#pablo" onClick={(e) => e.preventDefault()}>
            Test Manager
          </a>
        </div>
      </nav>
    </>
  );
}
