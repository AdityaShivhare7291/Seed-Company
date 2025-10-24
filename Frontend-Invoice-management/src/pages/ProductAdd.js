import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProducts } from "../store/slice/ProductSlice";


const ProductForm = () => {
    const dispatch = useDispatch();
    const workerDetails = useSelector((state) => state.user)

    const [form, setForm] = useState({
        cropName: "",
        Variety: "",
        quantity: 0
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
        if (!form.cropName || !form.Variety) {
            setMessage("Please fill in all required fields.");
            return;
        }

        try {
            const payload = {
                cropName: form.cropName,
                Variety: form.Variety,
                quantity: form.quantity,
                workerId: workerDetails.userDetails.workerId
            }
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/products/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setMessage("Product added successfully!");
                dispatch(updateProducts(payload))
                setForm({
                    cropName: "",
                    Variety: "",
                    quantity: 0
                });
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Failed to add product.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="col-span-10 p-6 ml-12 mr-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
            {message && <p className="mb-4 text-center text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Crop Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="cropName">
                        Crop Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="cropName"
                        name="cropName"
                        value={form.cropName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter Crop Name"
                        required
                    />
                </div>

                {/* Variety */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="Variety">
                        Variety<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="Variety"
                        name="Variety"
                        value={form.Variety}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter Variety"
                        required
                    />
                </div>

                {/* Variety */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="Variety">
                        Quantity<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="quantity"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter Quantity"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="mb-4 col-span-2">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 focus:ring focus:ring-indigo-400"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
