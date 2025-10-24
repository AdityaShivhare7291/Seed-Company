import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addCustomer } from "../store/slice/CustomerSlice";
import { commafy } from "commafy-anything";

const CustomerList = () => {
    const dispatch = useDispatch()
    const customerDetails = useSelector((state) => state.customer.customers);
    const [filters, setFilters] = useState({
        search: "",
        address: "",
        phoneNo: "",
        custType: "",
    });
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const navigate = useNavigate();
    console.log({ customerDetails })

    // Update filters dynamically
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/customer/getAllCustomers`); // Replace with your API endpoint to fetch products
                const data = await response.json();
                console.log({ data })
                dispatch(addCustomer(data)); // Update Redux store with fetched products
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchCustomers()
    }, [])


    // Filter the customers based on the filters state
    const filterCustomers = () => {
        return customerDetails.filter((customer) => {
            const matchesSearch =
                filters.search === "" ||
                customer.name.toLowerCase().includes(filters.search.toLowerCase());

            const matchesAddress =
                filters.address === "" ||
                (customer.address &&
                    customer.address.toLowerCase().includes(filters.address.toLowerCase()));

            const matchesPhone =
                filters.phoneNo === "" ||
                customer.phoneNo.includes(filters.phoneNo);

            const matchesCustType =
                filters.custType === "" ||
                customer.custType.toLowerCase() === filters.custType.toLowerCase();

            return matchesSearch && matchesAddress && matchesPhone && matchesCustType;
        });
    };

    // Update the filtered customers whenever filters or customerDetails change
    useEffect(() => {
        setFilteredCustomers(filterCustomers());
    }, [filters, customerDetails]);

    return (
        <div className="col-span-10 p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Customer List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Search by address"
                    value={filters.address}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                <input
                    type="text"
                    name="phoneNo"
                    placeholder="Search by phone number"
                    value={filters.phoneNo}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                <select
                    name="custType"
                    value={filters.custType}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                >
                    <option value="">Filter by Type</option>
                    <option value="party">Party</option>
                    <option value="normal">Normal</option>
                </select>
            </div>
            {filteredCustomers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-md">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Name</th>
                                <th className="py-2 px-4 border-b text-left">Worker</th>
                                <th className="py-2 px-4 border-b text-left">Phone No</th>
                                <th className="py-2 px-4 border-b text-left">Address</th>
                                <th className="py-2 px-4 border-b text-left">Amount</th>
                                <th className="py-2 px-4 border-b text-left">Type</th>
                                <th className="py-2 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.customerId} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{customer?.name ?? "undefined"}</td>
                                    <td className="py-2 px-4 border-b">{customer?.Worker?.name ?? "undefined"}</td>
                                    <td className="py-2 px-4 border-b">{customer?.phoneNo ?? "undefined"}</td>
                                    <td className="py-2 px-4 border-b">
                                        {customer.address || "N/A"}
                                    </td>
                                    <td
                                        className="py-2 px-4 border-b"
                                        style={{
                                            color: customer.amount < 0 ? "red" : "green",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {
                                            customer.amount < 0 ? commafy((customer.amount * -1).toFixed(2)) : commafy(customer.amount.toFixed(2))
                                        }
                                    </td>
                                    <td className="py-2 px-4 border-b">{customer?.custType}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => navigate('/customer/tabs', { state: { customer } })} className="bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-500 mr-2">
                                            View User Details
                                        </button>
                                        <button onClick={() => navigate('/overview', { state: { customer } })} className="bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-500 mr-2">
                                            View Bank Balance
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">No customers found.</p>
            )}
        </div>
    );
};

export default CustomerList;
