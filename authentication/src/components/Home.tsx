// import React, { useState } from "react";
// import gift from "../assets/gift.gif";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import {useLocation} from "react-router-dom"
// import character from "../assets/character.gif"

const Home = () => {
  // const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

  const showDashboard = location.pathname === "/Home";

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // const handleGiftClick = () => {
  //   setShowMessage(true);
  //   setTimeout(() => setShowMessage(false), 2000);
  // };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Sidebar/>
      {showDashboard && <Dashboard />} 
      {/* <div className="flex-grow grid place-items-center bg-gray-100 relative">
        <div
          onClick={handleGiftClick}
          className="bg-red-500 rounded-lg shadow-lg cursor-pointer flex items-center justify-center hover:scale-110 transition-transform animate-bounce-slow"
        >
          <div className="bg-white rounded-md flex items-center justify-center text-2xl font-bold text-red-500">
            <img className="w-full h-full" src={gift} alt="gift" />
          </div>
        </div>

        {showMessage && (
          <div className="absolute inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Short Message
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="static-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <div className="p-4 md:p-5 space-y-4">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Thank you for the opportunity
                  </p>
                  <img src={character} alt="character" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Home;
