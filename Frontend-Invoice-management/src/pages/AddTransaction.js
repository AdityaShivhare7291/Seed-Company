import React, { useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const TransactionPage = () => {

    const [transactionType, setTransactionType] = useState("credit");
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [transactionDate, setTransactionDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    })
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("")
    const [voucherNo, setVoucherNo] = useState(null)
    const [accountId, setAccountId] = useState("");
    const [workerId, setWorkerId] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const accounts = useSelector((state) => state.account.accounts);
    const userDetails = useSelector((state) => state.user.userDetails)


    const { state } = useLocation();  // Get passed props from state
    const { customerId } = state || {};  // Destructure the customer object
    console.log({ customerId, userDetails, accounts })

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        const transactionData = {
            customerId,
            accountId,
            voucherNo: voucherNo ?? null,
            workerId: userDetails.workerId,
            date: transactionDate,
            paymentMode,
            transactionType,
            amount: parseFloat(amount),
            description
        };

        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/api/transaction`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(transactionData),
                }
            );

            if (!response.ok) {
                console.log({ response })
                throw new Error("Failed to create transaction.");
            }

            const data = await response.json();
            setSuccessMessage("Transaction created successfully!");
            // Reset state variables to initial values
            setTransactionType("credit");
            setPaymentMode("Cash");
            setAmount("");
            setAccountId("");
            setWorkerId("");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-span-10 p-6 ml-12 mr-12">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 4,
                    margin: "0 auto",
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Create Transaction for Customer ID: {customerId}
                </Typography>

                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <form onSubmit={handleTransactionSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="transactionType">
                            Transaction Type<span className="text-red-500">*</span>
                        </label>
                        <select
                            id="transactionType"
                            name="transactionType"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="transactionType">
                            Transaction Date<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="transactionDate"
                            name="transactionDate"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />

                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="paymentMode">
                            Payment Mode<span className="text-red-500">*</span>
                        </label>
                        <select
                            id="paymentMode"
                            name="paymentMode"
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
                        </select>
                    </div>



                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="amount">
                            Amount<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="accountId">
                            Account<span className="text-red-500">*</span>
                        </label>
                        <select
                            id="accountId"
                            name="accountId"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="">Select an account</option>
                            {accounts.map((account) => (
                                <option key={account.accountId} value={account.accountId}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="amount">
                            Voucher No<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="voucherNo"
                            name="voucherNo"
                            value={voucherNo}
                            onChange={(e) => setVoucherNo(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter Voucher No"
                            required
                        />
                    </div>


                    <div className="mb-4 col-span-2">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 focus:ring focus:ring-indigo-400"

                        >
                            {loading ? <CircularProgress size={24} /> : "Submit Transaction"}
                        </button>
                    </div>
                </form>
            </Box>
        </div>
    );
};

export default TransactionPage;
