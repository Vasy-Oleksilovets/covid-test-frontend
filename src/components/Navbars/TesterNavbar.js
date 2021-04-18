// @ts-nocheck
import React, {useContext} from "react";
import {ProfileContext} from '../../context/ProfileContext';

export default function Navbar() {
  const profile = useContext(ProfileContext);
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Test Administrator - {profile.userProfile.location}
          </a>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
