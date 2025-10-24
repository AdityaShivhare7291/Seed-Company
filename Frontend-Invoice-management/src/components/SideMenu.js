import React from "react";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {
    const location = useLocation();
    const localStorageData = JSON.parse(localStorage.getItem("user"));

    const menuItems = [
        { path: "/", label: "Dashboard", icon: "dashboard-icon.png" },
        { path: "/customer/add", label: "Add Customer", icon: "supplier-icon.png" },
        { path: "/product/add", label: "Add Product", icon: "add-product.png" },
        { path: "/customer/receiptAdd", label: "Create Receipt", icon: "order-icon.png" },
        { path: "/customer/viewAll", label: "View Customers", icon: "supplier-icon.png" },
        { path: "/accountPage", label: "Accounts", icon: "reports-icon.png" },
        { path: "/StockList", label: "Stocks", icon: "inventory-icon.png" },
        { path: "/sendMail", label: "Send Mail", icon: "order-icon.png" },
        { path: "/pdfViewer", label: "Send PDF", icon: "reports-icon.png" },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getActiveClass = (path) => {
        return isActive(path)
            ? "flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 font-semibold"
            : "flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700";
    };

    return (
        <div className="h-full flex-col justify-between bg-white hidden lg:flex">
            <div className="px-4 py-6">
                <div className="text-center mb-6">
                    <img
                        className="mx-auto h-10 w-auto"
                        src={require("../assets/logo.png")}
                        alt="Logo"
                    />
                </div>
                <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={getActiveClass(item.path)}
                        >
                            <img
                                alt={item.label}
                                src={require(`../assets/${item.icon}`)}
                                className="w-5 h-5"
                            />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                            {localStorageData?.firstName?.charAt(0) || "U"}
                        </span>
                    </div>

                    <div>
                        <p className="text-xs">
                            <strong className="block font-medium">
                                {localStorageData?.name || "User"}
                            </strong>
                            <span className="text-gray-500">
                                {localStorageData?.role || "Worker"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideMenu;
