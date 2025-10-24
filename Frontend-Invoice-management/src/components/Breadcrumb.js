import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  
  const routeNames = {
    "/": "Dashboard",
    "/customer/add": "Add Customer",
    "/product/add": "Add Product",
    "/customer/viewAll": "View Customers",
    "/customer/receiptAdd": "Create Receipt",
    "/customer/tabs": "Customer Details",
    "/customer/addTransaction": "Add Transaction",
    "/accountPage": "Accounts",
    "/accountPageList": "Account List",
    "/StockList": "Stock List",
    "/sendMail": "Send Email",
    "/invoiveGenerator": "Invoice Generator",
    "/overview": "Overview",
    "/pdfViewer": "PDF Viewer",
    "/imageReceipt": "Image Receipt",
  };

  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-white px-4 py-3 border-b border-gray-200">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link
            to="/"
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
        </li>

        {pathnames.length > 0 && (
          <>
            <li className="text-gray-400">/</li>
            <li>
              <span className="text-gray-900 font-medium">
                {routeNames[location.pathname] || pathnames[pathnames.length - 1]}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
