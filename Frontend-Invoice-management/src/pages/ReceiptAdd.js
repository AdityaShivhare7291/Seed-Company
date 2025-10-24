import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../store/slice/CustomerSlice";
import { useDispatch } from "react-redux";

const ReceiptAdd = ({ data }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const workerDetails = useSelector((state) => state.user);
    const productList = useSelector((state) => state.products.products);
    const userDetails = useSelector((state) => state.customer.customers);
    const accountDetails = useSelector((state) => state.account.accounts);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    console.log("all data fetch from store", { workerDetails, productList, accountDetails, userDetails })

    const { state } = useLocation();
    const { customerId } = state || {};

    const [searchResult, setSearchResults] = useState({ name: true, address: true, phoneNo: true })
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

    const [filteredUsers, setFilteredUsers] = useState(userDetails);

    const handleChangeUserDetails = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));

        // Filter userDetails based on input
        const filtered = userDetails.filter((user) => {
            return (
                (!form.name || user.name.toLowerCase().includes(form.name.toLowerCase())) &&
                (!form.address ||
                    user.address.toLowerCase().includes(form.address.toLowerCase())) &&
                (!form.phoneNo ||
                    user.phoneNo.includes(form.phoneNo))
            );
        });

        console.log({ filtered })
        setFilteredUsers(filtered);
    };

    const [form, setForm] = useState({
        name: "",
        phoneNo: "",
        date: new Date().toISOString().split("T")[0], // Format date as YYYY-MM-DD
        address: "",
        lotNo: "",
        accountId: "",
        weightType: "Select Sale Type",
        saleType: "",
        truckNo: "",
        tonWeight: "",
        noOfBags: "",
        parchiNo: "",
        deduction: "",
        packingSize: "",
        rate: "",
        discount: "",
        description: "",
        cropName: "Select Crop Name",
        cropVariety: "Select Crop Variety",
        netWeight: 0,
        amount: 0,
        finalAmount: 0
    });

    const [showDetails, setShowDetails] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    useEffect(() => {
        // Reset relevant fields when `weightType` changes
        setForm((prev) => ({
            ...prev,
            tonWeight: "",
            accountId: "",
            packingSize: "",
            noOfBags: "",
            saleType: "Select Sale Type",
            deduction: "",
            rate: "",
            discount: "",
            description: "",
            netWeight: 0,
            amount: 0,
            finalAmount: 0,
            cropName: "Select Crop Name",
            cropVariety: "Select Crop Variety",
        }));
    }, [form.weightType]);

    // useEffect(() => {
    //     data(form)
    // }, [form])

    useEffect(() => {
        const calculateValues = () => {
            let netWeight = 0;
            let amount = 0;

            if (form.weightType === "TON weight") {
                const tonWeight = parseFloat(form.tonWeight || 0);
                const noOfBags = parseInt(form.noOfBags || 0, 10);
                const deduction = parseFloat(form.deduction || 0);
                netWeight = tonWeight - noOfBags * deduction;
            } else if (form.weightType === "Packing size") {
                const packingSize = parseFloat(form.packingSize || 0);
                const noOfBags = parseInt(form.noOfBags || 0, 10);
                netWeight = packingSize * noOfBags;
            }

            const rate = parseFloat(form.rate || 0);
            amount = rate * (netWeight / 100);
            let finalAmount = amount - form.discount

            if (netWeight !== form.netWeight || amount !== form.amount || finalAmount !== form.finalAmount) {
                setForm((prev) => ({ ...prev, netWeight: netWeight / 100, amount, finalAmount }));
            }
        };

        calculateValues();
    }, [
        form.weightType,
        form.tonWeight,
        form.noOfBags,
        form.deduction,
        form.packingSize,
        form.rate,
        form.discount
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const isCropNameValid = productList.some((product) => product.cropName === form.cropName);
        const isCropVarietyValid = productList.some(
            (product) => product.cropName === form.cropName && product.Variety === form.cropVariety
        );

        const collectiveExist = productList.filter((product) => {
            return product.cropName === form.cropName && product.Variety === form.cropVariety
        })

        if (!isCropNameValid) {
            alert("Invalid Crop Name selected.");
            return;
        }

        if (!isCropVarietyValid) {
            alert("Invalid Crop Variety selected for the chosen Crop Name.");
            return;
        }

        const payload = {
            name: form.name,
            address: form.address,
            phoneNo: form.phoneNo,
            customerId: customerId ?? null,
            workerId: workerDetails?.workerId ?? '1',
            accountId: form?.accountId ?? '1',
            productId: collectiveExist[0]?.cropId ?? '1',
            amount: parseFloat(form.amount),
            saleType: form.saleType,
            rate: parseFloat(form.rate),
            discount: parseFloat(form.discount),
            finalAmount: parseFloat(form.finalAmount),
            weightType: form.weightType,
            deduction: parseFloat(form.deduction),
            noOfBags: parseFloat(form.noOfBags),
            description: form.description,
            netWeight: form.netWeight,
            parchiNo: form?.parchiNo,
            date: form.date,
            truckNo: form.truckNo,
            isActive: true
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/receipt/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // Check for non-OK response
            if (!response.ok) {
                const errorText = await response.text(); // Capture error response
                console.error(`Error ${response.status}: ${errorText}`);
                setErrorMessage(`Error: ${errorText}`);
                return;
            }

            // Parse response if successful
            const data = await response.json();
            console.log("API Response:", data);

            if ((data?.customer?.customerId ?? null) && form.isActive) {
                navigate("/customer/addTransaction", { state: { customerId: data.customer.customerId } })
            }

            // Handle success
            setSuccessMessage("Successfully created receipt");

            setForm((prev) => ({
                ...prev,
                date: new Date(),
                tonWeight: "",
                packingSize: "",
                noOfBags: "",
                saleType: "Select Sale Type",
                deduction: "",
                rate: "",
                discount: "",
                description: "",
                netWeight: 0,
                amount: 0,
                finalAmount: 0,
                cropName: "Select Crop Name",
                cropVariety: "Select Crop Variety",
            }));
            //  navigate('/invoiveGenerator', { state: { receiptDatam: { ...payload, workerDetails, productList, accountDetails, productId: collectiveExist[0]?.cropId ?? '1', customerId } } })
        } catch (error) {
            console.error("Error in creating Receipt:", error.message || error);
            setErrorMessage("An error occurred while creating the receipt.");
        }
        console.log("Submitted Data:", { form });
    };

    const getCropVarieties = () =>
        productList
            .filter((product) => product.cropName === form.cropName)
            .map((product) => product.Variety);

    return (
        <div className="col-span-10 p-6 ml-12 mr-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Receipt</h2>
            {
                <>

                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lot No */}
                        {
                            !customerId ? (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onFocus={() => setSearchResults({ ...searchResult, name: true })}
                                            onChange={handleChangeUserDetails}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            required
                                        />
                                        {/* Dropdown List for Names */}
                                        {form.name && searchResult.name && (
                                            <ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg z-10">
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map((user, index) => (
                                                        <li
                                                            key={index}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setForm((prev) => ({ ...prev, name: user.name }))
                                                                setSearchResults({ ...searchResult, name: false })
                                                            }}
                                                        >
                                                            {user.name}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="px-4 py-2 text-gray-500"
                                                        onClick={() => {
                                                            setSearchResults({ ...searchResult, name: false })
                                                        }}>No matching names found</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Address<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChangeUserDetails}
                                            onFocus={() => setSearchResults({ ...searchResult, address: true })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            required
                                        />
                                        {/* Dropdown List for Names */}
                                        {form.address && searchResult.address && (
                                            <ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg z-10">
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map((user, index) => (
                                                        <li
                                                            key={index}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {

                                                                setForm((prev) => ({ ...prev, address: user.address }))
                                                                setSearchResults({ ...searchResult, address: false })
                                                            }}
                                                        >
                                                            {user.address}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="px-4 py-2 text-gray-500" onClick={() => {
                                                        setSearchResults({ ...searchResult, address: false })
                                                    }}>No matching names found</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                                            Phone No<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="phoneNo"
                                            name="phoneNo"
                                            value={form.phoneNo}
                                            onFocus={() => setSearchResults({ ...searchResult, phoneNo: true })}
                                            onChange={handleChangeUserDetails}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            required
                                        />
                                        {/* Dropdown List for Names */}
                                        {form.phoneNo && searchResult.phoneNo && (
                                            <ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg z-10">
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map((user, index) => (
                                                        <li
                                                            key={index}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {

                                                                setForm((prev) => ({ ...prev, phoneNo: user.phoneNo }))
                                                                setSearchResults({ ...searchResult, phoneNo: false })
                                                            }}
                                                        >
                                                            {user.phoneNo}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="px-4 py-2 text-gray-500" onClick={() => {

                                                        setSearchResults({ ...searchResult, phoneNo: false })
                                                    }}>No matching names found</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </>
                            ) : null
                        }
                        <div className="mb-4">
                            <label htmlFor="lotNo" className="block text-sm font-medium text-gray-700">
                                Vehicle No<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="truckNo"
                                name="truckNo"
                                value={form.truckNo}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        {/* Weight Type */}
                        <div className="mb-4">
                            <label htmlFor="weightType" className="block text-sm font-medium text-gray-700">
                                Weight Type<span className="text-red-500">*</span>
                            </label>
                            <select
                                id="weightType"
                                name="weightType"
                                value={form.weightType}
                                onChange={(e) => {
                                    handleChange(e);
                                    setShowDetails(true);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                <option value="Select Weight Type">Select Weight Type</option>
                                <option value="TON weight">TON Weight</option>
                                <option value="Packing size">Packing Size</option>
                            </select>
                        </div>

                        {/* Weight Type */}

                        <div className="mb-4">
                            <label htmlFor="saleType" className="block text-sm font-medium text-gray-700">
                                Date<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </div>


                        <div className="mb-4">
                            <label htmlFor="saleType" className="block text-sm font-medium text-gray-700">
                                Sale Type<span className="text-red-500">*</span>
                            </label>
                            <select
                                id="saleType"
                                name="saleType"
                                value={form.saleType}
                                onChange={(e) => {
                                    handleChange(e);
                                    setShowDetails(true);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                <option value="Select Sale Type">Select Sale Type</option>
                                <option value="Buy">Buy</option>
                                <option value="Sale">Sale</option>
                            </select>
                        </div>

                        {showDetails && form.saleType !== "Select Sale Type" && (
                            <>

                                {/* <div className="mb-4">
                                    <label htmlFor="cropName" className="block text-sm font-medium text-gray-700">
                                        Account Name<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="accountId"
                                        name="accountId"
                                        value={form.accountId}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                        <option value="Select Account Name">Select Account Name</option>
                                        {[
                                            ...new Set(accountDetails.map((account) => account)),
                                        ].map((account) => (
                                            <option key={account.accountId} value={account.accountId}>
                                                {account.name}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}


                                {/* Crop Name */}
                                <div className="mb-4">
                                    <label htmlFor="cropName" className="block text-sm font-medium text-gray-700">
                                        Crop Name<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="cropName"
                                        name="cropName"
                                        value={form.cropName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    >
                                        <option value="Select Crop Name">Select Crop Name</option>
                                        {[
                                            ...new Set(productList.map((product) => product.cropName)),
                                        ].map((crop) => (
                                            <option key={crop} value={crop}>
                                                {crop}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Crop Variety */}
                                {form.cropName !== "Select Crop Name" && (
                                    <div className="mb-4">
                                        <label htmlFor="cropVariety" className="block text-sm font-medium text-gray-700">
                                            Crop Variety<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="cropVariety"
                                            name="cropVariety"
                                            value={form.cropVariety}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            required
                                        >
                                            <option value="Select Crop Variety">Select Crop Variety</option>
                                            {getCropVarieties().map((variety) => (
                                                <option key={variety} value={variety}>
                                                    {variety}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

                        {showDetails && form.saleType !== "Select Sale Type" && form.cropName !== "Select Crop Name" && form.cropVariety !== "Select Crop Variety" && (
                            <>
                                {form.weightType === "TON weight" && (
                                    <>
                                        <div className="mb-4">
                                            <label htmlFor="tonWeight" className="block text-sm font-medium text-gray-700">
                                                TON Weight<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="tonWeight"
                                                name="tonWeight"
                                                value={form.tonWeight}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="noOfBags" className="block text-sm font-medium text-gray-700">
                                                No of Bags<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="noOfBags"
                                                name="noOfBags"
                                                value={form.noOfBags}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="deduction" className="block text-sm font-medium text-gray-700">
                                                Deduction per Bag<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="deduction"
                                                name="deduction"
                                                value={form.deduction}
                                                onChange={handleChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                    </>
                                )}
                            </>)
                        }
                        <div className="mb-4">
                            <label htmlFor="noOfBags" className="block text-sm font-medium text-gray-700">
                                Voucher No<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="parchiNo"
                                name="parchiNo"
                                value={form.parchiNo}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        {form.weightType === "Packing size" && form.saleType !== "Select Sale Type" && form.cropName !== "Select Crop Name" && form.cropVariety !== "Select Crop Variety" && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="noOfBags" className="block text-sm font-medium text-gray-700">
                                        No of Bags<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="noOfBags"
                                        name="noOfBags"
                                        value={form.noOfBags}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="packingSize" className="block text-sm font-medium text-gray-700">
                                        Packing Size<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="packingSize"
                                        name="packingSize"
                                        value={form.packingSize}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                            </>
                        )}

                        {form.weightType && form.saleType !== "Select Sale Type" && form.cropName !== "Select Crop Name" && form.cropVariety !== "Select Crop Variety" &&
                            (<>
                                <div className="mb-4">
                                    <label htmlFor="netWeight" className="block text-sm font-medium text-gray-700">
                                        Net Weight
                                    </label>
                                    <input
                                        type="number"
                                        id="netWeight"
                                        name="netWeight"
                                        value={(form.netWeight)}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                                        Rate<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="rate"
                                        name="rate"
                                        value={form.rate}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={form.amount}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                                        Discount
                                    </label>
                                    <input
                                        type="number"
                                        id="discount"
                                        name="discount"
                                        value={form.discount}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="finalAmount" className="block text-sm font-medium text-gray-700">
                                        Final Amount
                                    </label>
                                    <input
                                        type="number"
                                        id="finalamount"
                                        name="finalamount"
                                        value={form.finalAmount}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="checkBox" className="block text-sm font-medium text-gray-700">
                                        Check Box
                                    </label>
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) => setForm({ ...form, isActive: !form.isActive })}
                                    />
                                </div>
                            </>
                            )
                        }

                        {/* Net Weight, Final Amount, Discount, etc. */}
                        <div className="col-span-2">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </div>
                    </form>

                </>
            }

        </div>
    );
};

export default ReceiptAdd;
