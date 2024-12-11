import { useState } from "react";

const Sidebar = () => {
  const [route, selectedRoute] = useState<string>('/Home');
  const handleIndex = (selected: string) => {
    selectedRoute(selected);
  };

  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {/* Add Button */}
            <li>
              <button
                type="button"
                id="createProductModalButton"
                data-modal-target="createProductModal"
                data-modal-toggle="createProductModal"
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm text-white focus:outline-none"
              >
                Add
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
