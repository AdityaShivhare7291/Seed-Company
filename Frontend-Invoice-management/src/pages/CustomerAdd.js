import React, { useState } from "react";
import { useSelector } from "react-redux";
import { updateCustomer } from "../store/slice/CustomerSlice";
import { useDispatch } from "react-redux";

const CustomerForm = () => {

    const dispatch = useDispatch();
    const workerDetails = useSelector((state) => state.user)
    const [form, setForm] = useState({
        name: "",
        address: "",
        phoneNo: "",
        custType: "",
        hisaab: "Select Hisaab", // Default value
        amount: "",
        workerId: workerDetails.userDetails.workerId,
    });
    const [message, setMessage] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation



        console.log({ form, workerDetails })
        if (!form.name || !form.phoneNo || !form.amount || form.hisaab === 'Select Hisaab' || form.custType === '') {
            setMessage("Please fill in all required fields.");
            return;
        }

        let converter;
        switch (form.hisaab) {
            case 'Lena':
                converter = 1;
                break;
            case 'Dena':
                converter = -1;
        }

        const payload = {
            name: form.name,
            phoneNo: form.phoneNo,
            address: form.address,
            amount: form.amount,
            custType: form.custType,
            amount: form.amount * converter,
            workerId: workerDetails.userDetails.workerId
        }
        console.log({ payload })

        try {
            console.log({ payload })
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/customer/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage("Customer created successfully!");
                dispatch(updateCustomer(payload))
                setForm({
                    name: "",
                    address: "",
                    phoneNo: "",
                    custType: "normal",
                    amount: "",
                    workerId: workerDetails.workerId,
                });
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Failed to create customer.");
            }
        } catch (error) {
            console.error("Error creating customer:", error);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="col-span-10 p-6 ml-12 mr-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Customer</h2>
            {message && <p className="mb-4 text-center text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                        Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter name"
                        required
                    />
                </div>

                {/* Address */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="address">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter address"
                    />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="phoneNo">
                        Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="phoneNo"
                        name="phoneNo"
                        value={form.phoneNo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter phone number"
                        required
                    />
                </div>

                {/* Customer Type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="custType">
                        Customer Type
                    </label>
                    <select
                        id="custType"
                        name="custType"
                        value={form.custType}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="normal">Normal</option>
                        <option value="party">Party</option>
                    </select>
                </div>

                {/* Amount */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="amount">
                        Amount<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter amount"
                        required
                    />
                </div>

                {/* Customer Type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="custType">
                        Purana Hisaab
                    </label>
                    <select
                        id="hisaab"
                        name="hisaab"
                        value={form.hisaab}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="Select Hisaab">Select Hisaab</option>
                        <option value="Lena">Lena</option>
                        <option value="Dena">Dena</option>
                    </select>
                </div>
                {/* Submit Button */}
                <div className="mb-4 col-span-2">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 focus:ring focus:ring-indigo-400"
                    >
                        Create Customer
                    </button>
                </div>
            </form>
        </div>


    );
};
export default CustomerForm;
