"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { addCustomer } from "../store/slice/CustomerSlice";
import { useNavigate, useLocation } from "react-router-dom";
import VerificationModal from "../components/ReceiptModal";


const FormField = ({ label, required = false, children, className = "" }) => (
    <div className={`mb-4 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
    </div>
)


const SearchableInput = ({
    value,
    onChange,
    onFocus,
    placeholder,
    suggestions,
    field,
    showSuggestions,
    onSelectSuggestion,
    onCloseSuggestions,
    required = false,
}) => {

    const [handleSuggestion, setHandleSuggestion] = useState(false)
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setHandleSuggestion(false);
                //onCloseSuggestions();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onCloseSuggestions]);

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e)}
                onFocus={(e) => {
                    setHandleSuggestion(true)
                    onFocus(e)
                }}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={required}
            />
            {value && handleSuggestion && showSuggestions && (
                <ul onClick={(e) => e.stopPropagation()} className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {suggestions.length > 0 ? (
                        suggestions.map((user, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => {
                                    onSelectSuggestion(user)
                                    onCloseSuggestions()
                                }}
                            >
                                <div className="font-medium">{user[field]}</div>
                                {field !== "name" && <div className="text-sm text-gray-500">{user.name}</div>}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500 cursor-pointer" onClick={onCloseSuggestions}>
                            No matching results found
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}

const VarietyRow = ({
    item,
    index,
    availableVarieties,
    weightType,
    onUpdate,
    onRemove,
}) => {

    console.log("weight", weightType)
    const handleChange = (field, value) => {
        let updated = { ...item, [field]: value };

        if (weightType === "Packing size") {
            // Calculate quantity = noOfBags * packingSize
            if (field === "noOfBags" || field === "packingSize") {
                const noOfBags = field === "noOfBags" ? value : item.noOfBags || 0;
                const packingSize = field === "packingSize" ? value : item.packingSize || 0;
                updated.quantity = noOfBags * packingSize;
            }
        }

        // Auto-calculate amount if quantity or rate changes
        if (field === "quantity" || field === "rate" || field === "noOfBags" || field === "packingSize") {
            updated.amount = (updated.quantity || 0) * (updated.rate || 0);
        }

        onUpdate(item.id, updated);
    };

    return (
        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Variety #{index + 1}</h4>
                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                >
                    Remove
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField label="Variety" required>
                    <select
                        value={item.variety}
                        onChange={(e) => handleChange("variety", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Variety</option>
                        {availableVarieties.map((variety) => (
                            <option key={variety} value={variety}>
                                {variety}
                            </option>
                        ))}
                    </select>
                </FormField>

                {weightType === "Packing size" ? (
                    <>
                        <FormField label="No of Bags" required>
                            <input
                                type="number"
                                onWheel={(e) => e.currentTarget.blur()} // removes scroll change
                                value={item.noOfBags || 0}
                                onChange={(e) => handleChange("noOfBags", Number(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="1"
                                required
                            />
                        </FormField>

                        <FormField label="Packing Size" required>
                            <input
                                type="number"
                                value={item.packingSize || 0}
                                onChange={(e) => handleChange("packingSize", Number(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                                required
                            />
                        </FormField>
                    </>
                ) : (
                    <FormField label="Quantity" required>
                        <input
                            type="number"
                            onWheel={(e) => e.currentTarget.blur()} // removes scroll change
                            value={item.quantity || 0}
                            onChange={(e) => handleChange("quantity", Number(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                            required
                        />
                    </FormField>
                )}

                <FormField label="Rate" required>
                    <input
                        type="number"
                        value={item.rate || 0}
                        onChange={(e) => handleChange("rate", Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                        required
                    />
                </FormField>

                <FormField label="Amount">
                    <input
                        type="number"
                        value={(item.amount || 0).toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </FormField>
            </div>
        </div>
    );
};


const VarietySelector = ({
    cropName,
    varieties,
    availableVarieties,
    onVarietiesChange,
    weightType,
}) => {
    const addVariety = () => {
        const newVariety = {
            id: Date.now().toString(),
            variety: "",
            quantity: 0,
            rate: 0,
            amount: 0,
            // For packing type
            noOfBags: 0,
            packingSize: 0,
        };
        onVarietiesChange([...varieties, newVariety]);
    };

    const updateVariety = (id, updatedItem) => {
        const updatedVarieties = varieties.map((item) =>
            item.id === id ? updatedItem : item
        );
        onVarietiesChange(updatedVarieties);
    };

    const removeVariety = (id) => {
        onVarietiesChange(varieties.filter((item) => item.id !== id));
    };

    if (cropName === "Select Crop Name") return null;

    return (
        <div className="col-span-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Crop Varieties</h3>
                <button
                    type="button"
                    onClick={addVariety}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    + Add Variety
                </button>
            </div>

            {varieties.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                    No varieties added. Click "Add Variety" to start.
                </p>
            ) : (
                <div className="space-y-4">
                    {varieties.map((item, index) => (
                        <VarietyRow
                            key={item.id}
                            item={item}
                            index={index}
                            availableVarieties={availableVarieties}
                            weightType={weightType}
                            onUpdate={updateVariety}
                            onRemove={removeVariety}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Alert = ({ severity, children }) => (
    <div
        className={`p-4 rounded-md mb-4 ${severity === "success"
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
            }`}
    >
        {children}
    </div>
)

// Main Component
export default function ReceiptForm({ data }) {
    // Mock data - replace with actual data
    // Commented out Redux hooks - uncomment these when you integrate with your Redux store
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const workerDetails = useSelector((state) => state.user)
    const productList = useSelector((state) => state.products.products)
    const userDetails = useSelector((state) => state.customer.customers)
    const accountDetails = useSelector((state) => state.account.accounts)

    const { state } = useLocation()
    const { customerId } = state || {}
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        address: "",
        phoneNo: "",
        truckNo: "",
        weightType: "Select Weight Type",
        date: new Date().toISOString().split("T")[0],
        saleType: "Select Sale Type",
        cropName: "Select Crop Name",
        varieties: [{
            id: Date.now().toString(),
            variety: "",
            quantity: 0,
            rate: 0,
            amount: 0,
        }],
        tonWeight: 0,
        noOfBags: 0,
        deduction: 0,
        packingSize: 0,
        parchiNo: "",
        discount: 0,
        description: "",
        isActive: false,
        lotNo: "",
        accountId: "",
        netWeight: 0,
        amount: 0,
        finalAmount: 0,
    })

    useEffect(() => {
        document.addEventListener("wheel", function (event) {
            if (document.activeElement.type === "number") {
                document.activeElement.blur();
            }
        });
    }, [])

    const [searchResults, setSearchResults] = useState({
        name: false,
        address: false,
        phoneNo: false,
    })

    const [showDetails, setShowDetails] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [filteredUsers, setFilteredUsers] = useState(userDetails || [])

    const fetchCustomer = async () => {
        const response = await fetch(
            `/api/customer/getCustomerDetails?customerId=${customerId}`
        );
        const result = await response.json();
        console.log("Customer Details", { result });
        setForm((prev) => ({ ...prev, name: result.name, address: result.address, phoneNo: result.phoneNo }));
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // Commented out API call - uncomment when you have your backend URL
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/customer/getAllCustomers`)
                const data = await response.json()
                dispatch(addCustomer(data))
                console.log("Fetch customers - integrate with your Redux store")
            } catch (error) {
                console.error("Error fetching customers:", error)
            }
        }
        if (customerId) {
            fetchCustomer()
        }

        fetchCustomers()
    }, [])

    const handleSubmit = async () => {

        if (form.varieties.length === 0) {
            setErrorMessage("Please add at least one variety")
            return
        }

        const hasEmptyVariety = form.varieties.some((v) => !v.variety || v.quantity <= 0 || v.rate <= 0)
        if (hasEmptyVariety) {
            setErrorMessage("Please fill all variety details")
            return
        }

        for (const variety of form.varieties) {
            const isCropNameValid = (productList || []).some((product) => product.cropName === form.cropName)
            const isCropVarietyValid = (productList || []).some(
                (product) =>
                    product.cropName === form.cropName &&
                    (product.Variety === variety.variety || product.variety === variety.variety),
            )

            if (!isCropNameValid) {
                setErrorMessage("Invalid Crop Name selected")
                return
            }

            if (!isCropVarietyValid) {
                setErrorMessage(`Invalid Crop Variety "${variety.variety}" selected for the chosen Crop Name`)
                return
            }
        }

        console.log({ productList, varieties: form.varieties[0] })

        try {
            const products = form.varieties.map((variety, index) => {
                const matchedProduct = (productList || []).find(
                    (product) =>
                        product.cropName === form.cropName &&
                        (product.Variety === variety.variety || product.Variety === variety.variety)
                );

                let newData = { ...variety, _id: matchedProduct.cropId }
                delete newData.id
                return newData;
            })

            console.log("products", { products })

            const payload = {
                name: form.name,
                address: form.address,
                phoneNo: form.phoneNo,
                customerId: customerId ?? null,
                workerId: workerDetails?.workerId ?? "1",
                accountId: form?.accountId ?? "1",
                products: products,
                amount: subtotal,
                saleType: form.saleType,
                rate: rate,
                discount: form.discount,
                finalAmount: finalAmount,
                weightType: form.weightType,
                deduction: Number.parseFloat(form.deduction.toString()),
                noOfBags: Number.parseFloat(form.noOfBags.toString()),
                description: `${form.description}`,
                netWeight: form.netWeight,
                parchiNo: form?.parchiNo,
                date: form.date,
                truckNo: form.truckNo,
            }

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/receipt/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error(`Error ${response.status}: ${errorText}`)
                setErrorMessage(`Error: ${errorText}`)
                return
            } else {
                setShowVerificationModal(false)
            }

            const data = await response.json()
            console.log("API Response:", data)

            if ((data?.customer?.customerId ?? null) && form.isActive) {
                navigate("/customer/addTransaction", { state: { customerId: data.customer.customerId } })
            }

            setSuccessMessage("Successfully created receipts for all varieties")
            setErrorMessage("")

            setForm((prev) => ({
                ...prev,
                varieties: [],
                tonWeight: 0,
                packingSize: 0,
                noOfBags: 0,
                saleType: "Select Sale Type",
                deduction: 0,
                discount: 0,
                description: "",
                netWeight: 0,
                amount: 0,
                finalAmount: 0,
                cropName: "Select Crop Name",
            }))
        } catch (error) {
            console.error("Error in creating Receipt:", error)
            setErrorMessage("An error occurred while creating the receipt.")
        }
    }



    useEffect(() => {
        data(form)
    }, [form])

    const getFilteredUsers = (field) => {
        const value = form[field]?.toLowerCase() || "";

        return userDetails.filter((user) =>
            user[field]?.toLowerCase().includes(value)
        );
    };

    const getCropVarieties = () => {
        return productList
            .filter(product => product.cropName === form.cropName)
            .map(product => product.Variety);
    };


    const handleSelectUser = (user) => {
        setForm((prev) => ({
            ...prev,
            name: user.name,
            address: user.address,
            phoneNo: user.phoneNo,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log({ name, value })
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculateCombinedRate = () => {
        const totalQuantity = form.varieties.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQuantity === 0) return 0;

        const weightedSum = form.varieties.reduce(
            (sum, item) => sum + item.quantity * item.rate,
            0
        );

        return weightedSum / totalQuantity;
    };


    const calculateTotals = () => {
        let totalDeduction;
        if (form.weightType === "Packing size") {
            totalDeduction = 0;
        }

        // Step 1: Total weight from all varieties
        const totalWeight = form.varieties.reduce((sum, item) => sum + item.quantity, 0);
        totalDeduction = (form.deduction * form.noOfBags)
        // Step 2: Deduct ghatak wajan
        const netWeight = totalWeight - (totalDeduction || 0);

        // Step 3: Subtotal based on net weight distribution
        // If rate is stored in each variety, recalculate amounts using adjusted weight proportionally
        const subtotal = form.varieties.reduce((sum, item) => {
            // Adjust quantity proportionally
            const proportion = item.quantity / totalWeight;
            const adjustedQuantity = proportion * netWeight;
            return sum + (adjustedQuantity * item.rate);
        }, 0);

        // Step 4: Final amount after discount
        const finalAmount = subtotal - form.discount;
        const rate = calculateCombinedRate()

        const tolerance = 0.01;
        const shouldUpdate =
            Math.abs(form.netWeight - netWeight) > tolerance ||
            Math.abs(form.amount - subtotal) > tolerance ||
            Math.abs(form.finalAmount - finalAmount) > tolerance ||
            Math.abs((form.rate || 0) - rate) > tolerance;

        if (shouldUpdate) {
            setForm((prev) => ({
                ...prev,
                netWeight,
                amount: subtotal,
                finalAmount,
                rate,
            }));
        }


        return {
            rate,
            totalDeduction: totalDeduction,
            subtotal,
            finalAmount,
            netWeight
        };
    };

    useEffect(() => {
        setForm((prev) => ({ ...prev, varieties: [] }))
        data({ ...form, varieties: [] })
    }, [form.weightType])


    const { rate, subtotal, finalAmount, totalDeduction, netWeight } = calculateTotals()

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 bg-white">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Create Receipt</h2>

                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                    <form onSubmit={(e) => {
                        e.preventDefault()
                        setShowVerificationModal(true) // Open modal instead of direct submit
                    }} className="space-y-6">
                        {/* Customer Details Section */}
                        {!customerId && (
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                <h3 className="text-lg font-semibold mb-4 text-blue-800">Customer Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField label="Name" required>
                                        <SearchableInput
                                            value={form.name}
                                            onChange={(e) => {
                                                setForm((prev) => ({ ...prev, "name": e.target.value }))
                                            }}
                                            onFocus={() => setSearchResults((prev) => ({ ...prev, name: true }))}
                                            suggestions={getFilteredUsers("name")}
                                            field="name"
                                            showSuggestions={searchResults.name}
                                            onSelectSuggestion={handleSelectUser}
                                            onCloseSuggestions={() => setSearchResults((prev) => ({ ...prev, name: false }))}
                                            required
                                        />
                                    </FormField>

                                    <FormField label="Address" required>
                                        <SearchableInput
                                            value={form.address}
                                            onChange={(e) => {
                                                setForm((prev) => ({ ...prev, "address": e.target.value }))
                                            }}
                                            onFocus={() => setSearchResults((prev) => ({ ...prev, address: true }))}
                                            suggestions={getFilteredUsers("address")}
                                            field="address"
                                            showSuggestions={searchResults.address}
                                            onSelectSuggestion={handleSelectUser}
                                            onCloseSuggestions={() => setSearchResults((prev) => ({ ...prev, address: false }))}
                                            required
                                        />
                                    </FormField>

                                    <FormField label="Phone Number" required>
                                        <SearchableInput
                                            value={form.phoneNo}
                                            onChange={(e) => {
                                                setForm((prev) => ({ ...prev, "phoneNo": e.target.value }))
                                            }}
                                            onFocus={() => setSearchResults((prev) => ({ ...prev, phoneNo: true }))}
                                            suggestions={getFilteredUsers("phoneNo")}
                                            field="phoneNo"
                                            showSuggestions={searchResults.phoneNo}
                                            onSelectSuggestion={handleSelectUser}
                                            onCloseSuggestions={() => setSearchResults((prev) => ({ ...prev, phoneNo: false }))}
                                            required
                                        />
                                    </FormField>
                                </div>
                            </div>
                        )}

                        {/* Basic Details Section */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Transaction Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField label="Vehicle Number" required>
                                    <input
                                        type="text"
                                        name="truckNo"
                                        value={form.truckNo}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </FormField>

                                <FormField label="Weight Type" required>
                                    <select
                                        name="weightType"
                                        value={form.weightType}
                                        onChange={(e) => {
                                            handleChange(e)
                                            setShowDetails(true)
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Select Weight Type">Select Weight Type</option>
                                        <option value="TON weight">TON Weight</option>
                                        <option value="Packing size">Packing Size</option>
                                    </select>
                                </FormField>

                                <FormField label="Date" required>
                                    <input
                                        type="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </FormField>

                                <FormField label="Sale Type" required>
                                    <select
                                        name="saleType"
                                        value={form.saleType}
                                        onChange={(e) => {
                                            handleChange(e)
                                            setShowDetails(true)
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Select Sale Type">Select Sale Type</option>
                                        <option value="Buy">Buy</option>
                                        <option value="Sale">Sale</option>
                                    </select>
                                </FormField>
                            </div>
                        </div>

                        {/* Crop Selection */}
                        {showDetails && form.saleType !== "Select Sale Type" && (
                            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                <h3 className="text-lg font-semibold mb-4 text-green-800">Crop Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <FormField label="Crop Name" required>
                                        <select
                                            name="cropName"
                                            value={form.cropName}
                                            onChange={(e) => {
                                                handleChange(e)
                                                setForm((prev) => ({ ...prev, varieties: [] })) // Reset varieties when crop changes
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="Select Crop Name">Select Crop Name</option>
                                            {[...new Set(productList.map((product) => product.cropName))].map((crop) => (
                                                <option key={crop} value={crop}>
                                                    {crop}
                                                </option>
                                            ))}
                                        </select>
                                    </FormField>

                                    <FormField label="Voucher Number" required>
                                        <input
                                            type="number"
                                            name="parchiNo"
                                            value={form.parchiNo}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </FormField>
                                </div>

                                {/* Variety Selector */}
                                <VarietySelector
                                    cropName={form.cropName}
                                    varieties={form.varieties}
                                    availableVarieties={getCropVarieties()}
                                    onVarietiesChange={(varieties) => setForm((prev) => ({
                                        ...prev,
                                        varieties: Array.isArray(varieties)
                                            ? varieties // full replacement
                                            : [...prev.varieties, varieties] // single addition
                                    }))}
                                    weightType={form.weightType}
                                />
                            </div>
                        )}

                        {/* Additional Fields */}
                        {form.weightType === "TON weight" && form.varieties.length > 0 && (
                            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                <h3 className="text-lg font-semibold mb-4 text-yellow-800">Weight Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField label="Number of Bags" required>
                                        <input
                                            type="number"
                                            name="noOfBags"
                                            value={form.noOfBags}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </FormField>

                                    <FormField label="Deduction per Bag">
                                        <input
                                            type="number"
                                            name="deduction"
                                            value={form.deduction}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormField>
                                </div>
                            </div>
                        )}

                        {false && form.weightType === "Packing size" && form.varieties.length > 0 && (
                            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                <h3 className="text-lg font-semibold mb-4 text-purple-800">Packing Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Number of Bags" required>
                                        <input
                                            type="number"
                                            name="noOfBags"
                                            value={form.noOfBags}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </FormField>

                                    <FormField label="Packing Size">
                                        <input
                                            type="number"
                                            name="packingSize"
                                            value={form.packingSize}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormField>
                                </div>
                            </div>
                        )}

                        {/* Summary Section */}
                        {form.varieties.length > 0 && (
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Summary & Additional Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormField label="Net Weight">
                                        <input
                                            type="number"
                                            value={netWeight.toFixed(2)}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                        />
                                    </FormField>
                                    <FormField label="Total Deduction">
                                        <input
                                            type="number"
                                            value={totalDeduction.toFixed(2)}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                        />
                                    </FormField>
                                    <FormField label="Subtotal">
                                        <input
                                            type="number"
                                            value={subtotal.toFixed(2)}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                        />
                                    </FormField>
                                    <FormField label="Rate">
                                        <input
                                            type="number"
                                            value={rate?.toFixed(2)}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                        />
                                    </FormField>
                                    <FormField label="Discount">
                                        <input
                                            type="number"
                                            name="discount"
                                            value={form.discount}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    </FormField>
                                    <FormField label="Final Amount">
                                        <input
                                            type="number"
                                            name="finalAmount"
                                            value={finalAmount.toFixed()}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    </FormField>

                                    <FormField label="Description" className="md:col-span-2">
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Additional notes or description..."
                                        />
                                    </FormField>

                                    <FormField label="Active Status">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={form.isActive}
                                                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Mark as active</span>
                                        </div>
                                    </FormField>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        {
                            form.amount > 0 && form.rate > 0 && (
                                <div className="flex justify-center pt-6">
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Create Receipt
                                    </button>
                                </div>
                            )
                        }

                    </form>
                </div>

            </div>
            <VerificationModal open={showVerificationModal} onClose={() => setShowVerificationModal(false)} onConfirm={() => { handleSubmit() }} formData={form} />
        </>
    )
}
