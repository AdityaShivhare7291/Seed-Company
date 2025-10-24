import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination } from '@mui/material';
import { commafy } from 'commafy-anything';

const DataTable = () => {
    const [data, setData] = useState({ receipts: [], transactions: [] });
    const [loading, setLoading] = useState(true);

    const startDate = "2024-01-01"; // Example start date
    const endDate = "2024-12-31"; // Example end date

    const [date, setDate] = useState({
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0]
    })

    useEffect(() => {
        // Fetch data from the backend
        const fetchData = async () => {
            if (!date.startDate || !date.endDate)
                return;
            try {
                const response = await axios.post("/api/worker/getAllData", {
                    startDate: date.startDate,
                    endDate: date.endDate,
                });
                console.log(response)
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [date]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Account Receipts
                </Typography>
                <div className="mb-4">
                    <label htmlFor="saleType" className="block text-sm font-medium text-gray-700">
                        start Date<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={date.startDate}
                        onChange={(e) => setDate({ ...date, startDate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="saleType" className="block text-sm font-medium text-gray-700">
                        End Date<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={date.endDate}
                        onChange={(e) => setDate({ ...date, endDate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    />
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Receipt ID</TableCell>
                                <TableCell>Lot Number</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Worker</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.receipts?.length > 0 ? (
                                data.receipts.map((receipt) => (
                                    <TableRow key={receipt.receiptId}>
                                        <TableCell>{receipt.receiptId}</TableCell>
                                        <TableCell>{receipt.lotNumber}</TableCell>
                                        <TableCell>
                                            {receipt?.Customer?.name ? receipt.Customer.name : 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            {receipt.Worker ? receipt.Worker.name : 'Unknown'}
                                        </TableCell>
                                        <TableCell style={{
                                            color: receipt.saleType === 'Buy' ? 'red' : receipt.saleType === 'Sale' ? 'green' : 'black',
                                        }}>${commafy(receipt.finalAmount)}</TableCell>
                                        <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {receipt.netWeight ? receipt.netWeight : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No receipts available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Transactions
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Transaction ID</TableCell>
                                <TableCell>Customer ID</TableCell>
                                <TableCell>Account ID</TableCell>
                                <TableCell>Worker ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Payment Mode</TableCell>
                                <TableCell>Transaction Type</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.transactions?.length > 0 ? (
                                data.transactions.map((transaction) => (
                                    <TableRow key={transaction.transactionId}>
                                        <TableCell>{transaction.transactionId}</TableCell>
                                        <TableCell>{transaction?.Customer?.name ?? "Self"}</TableCell>
                                        <TableCell>{transaction.Account.name}</TableCell>
                                        <TableCell>{transaction.Worker.name}</TableCell>
                                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{transaction.paymentMode}</TableCell>

                                        <TableCell>{transaction.transactionType}</TableCell>
                                        <TableCell>${commafy(transaction.amount)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No transactions available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default DataTable;
