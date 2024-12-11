import React, { useEffect, useState } from "react";
import axios from "axios";
import avatar from "../assets/avatar.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Employee {
  _id: string;
  EName: string;
  Age: number;
  Address: string;
  Position: string;
}

const Card = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const maxVisiblePages = 7;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees!");
    }
  };

  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.EName.toLowerCase().includes(lowerCaseQuery) ||
        employee.Age.toString().includes(lowerCaseQuery) ||
        employee.Address.toLowerCase().includes(lowerCaseQuery) ||
        employee.Position.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const openDeleteModal = (id: string) => {
    setDeleteEmployeeId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteEmployeeId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!deleteEmployeeId) return;

    try {
      await axios.delete(`http://localhost:5000/employees/${deleteEmployeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees((prev) => prev.filter((employee) => employee._id !== deleteEmployeeId));
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee");
    } finally {
      closeDeleteModal();
    }
  };

  const handleUpdate = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedEmployee: Employee) => {
    try {
      await axios.put(
        `http://localhost:5000/updateEmployee/${updatedEmployee._id}`,
        updatedEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Employee updated successfully");

      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === updatedEmployee._id ? updatedEmployee : emp
        )
      );

      setShowUpdateModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Error updating employee");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeButton
        rtl
        pauseOnFocusLoss
        pauseOnHover
      />

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, age, address, or position"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Table for Employees */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left">Avatar</th>
              <th className="px-6 py-3 text-left">Employee Name</th>
              <th className="px-6 py-3 text-left">Position</th>
              <th className="px-6 py-3 text-left">Age</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => (
              <tr key={employee._id} className="border-b">
                <td className="px-6 py-3">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={avatar}
                    alt="avatar"
                  />
                </td>
                <td className="px-6 py-3 break-words max-w-xs">{employee.EName}</td>
                <td className="px-6 py-3 break-words max-w-xs">{employee.Position}</td>
                <td className="px-6 py-3">{employee.Age}</td>
                <td className="px-6 py-3 break-words max-w-xs">{employee.Address}</td>
                <td className="px-6 py-3 text-center">
                  <button
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md mr-2"
                    onClick={() => handleUpdate(employee)}
                  >
                    Update
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                    onClick={() => openDeleteModal(employee._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getVisiblePages().map((page) => (
          <button
            key={page}
            className={`px-4 py-2 mx-1 ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-md`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-md"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Update Employee Modal */}
      {showUpdateModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Update Employee</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateSubmit(selectedEmployee);
              }}
            >
              <div className="grid gap-4 mb-4">
                <div>
                  <label
                    htmlFor="EName"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Employee Name
                  </label>
                  <input
                    type="text"
                    id="EName"
                    value={selectedEmployee.EName}
                    onChange={(e) =>
                      setSelectedEmployee((prev) =>
                        prev
                          ? { ...prev, EName: e.target.value }
                          : selectedEmployee
                      )
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="Age"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="Age"
                    value={selectedEmployee.Age}
                    onChange={(e) =>
                      setSelectedEmployee((prev) =>
                        prev
                          ? { ...prev, Age: Number(e.target.value) }
                          : selectedEmployee
                      )
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="Address"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="Address"
                    value={selectedEmployee.Address}
                    onChange={(e) =>
                      setSelectedEmployee((prev) =>
                        prev
                          ? { ...prev, Address: e.target.value }
                          : selectedEmployee
                      )
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="Position"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Position
                  </label>
                  <input
                    type="text"
                    id="Position"
                    value={selectedEmployee.Position}
                    onChange={(e) =>
                      setSelectedEmployee((prev) =>
                        prev
                          ? { ...prev, Position: e.target.value }
                          : selectedEmployee
                      )
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this employee?</p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
