import React, { useState } from "react";
import axios from "axios";
import NotificationResult from "../result/NotificationResult";

const ProductModal = () => {
  const [discussion, setDiscussion] = useState({
    EName: "",
    Age: "",
    Address: "",
    Position: "",
  });
  const token = localStorage.getItem("token");
  const [success, setSuccess] = useState<string | null>(null);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDiscussion({
      ...discussion,
      [e.target.id]: e.target.value,
    });
  };

  const submitDiscussion = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/addEmployee", discussion, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSuccess(response.data.message);
        setDiscussion({ EName: "", Age: "", Address:"", Position:"" });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(discussion);
  };

  return (
    <>
      <div
        id="createProductModal"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Discussion
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-target="createProductModal"
                data-modal-toggle="createProductModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={submitDiscussion}>
              <div className="grid gap-4 mb-4">
                <div>
                  <label
                    htmlFor="EName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Employee Name
                  </label>
                  <input
                    onChange={handleInput}
                    value={discussion.EName}
                    type="text"
                    name="EName"
                    id="EName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type employee name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="Age"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Age
                  </label>
                  <input
                    onChange={handleInput}
                    value={discussion.Age}
                    type="number"
                    id="Age"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Input age"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="Address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <textarea
                    onChange={handleInput}
                    value={discussion.Address}
                    id="Address"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Input address"
                    required
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="Position"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Job Position
                  </label>
                  <textarea
                    onChange={handleInput}
                    value={discussion.Position}
                    id="Position"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Input job position"
                    required
                  ></textarea>
                </div>
              </div>
              <button className="text-white inline-flex items-center bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Add Details
              </button>
            </form>
          </div>
        </div>

        {success && (
          <NotificationResult
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}

      </div>
    </>
  );
};

export default ProductModal;
