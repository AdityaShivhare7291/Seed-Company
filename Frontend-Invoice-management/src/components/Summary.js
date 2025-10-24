import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { commafy } from 'commafy-anything';

const CustomerSummary = ({ customerId, customer }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/customer/getCustomerSummary?customerId=${customerId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching customer summary: ${response.statusText}`);
                }
                const data = await response.json();
                console.log({ data })
                setSummary(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [customerId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" variant="h6" align="center">
                {error}
            </Typography>
        );
    }

    if (!summary) {
        return (
            <Typography variant="h6" align="center">
                No summary data available for this customer.
            </Typography>
        );
    }

    const remainingTransaction = summary.totalCredit - summary.totalDebit;

    return (
        <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Customer Summary of {customer?.name}
            </Typography>
            <Box>
                <Typography variant="body1"><strong>Total Credit:</strong> ₹{commafy(summary.totalCredit.toFixed(2))}</Typography>
                <Typography variant="body1"><strong>Total Debit:</strong> ₹{commafy(summary.totalDebit.toFixed(2))}</Typography>
                <Typography variant="body1" color={remainingTransaction >= 0 ? "green" : "red"}>
                    <strong>Remaining Transaction:</strong> ₹{remainingTransaction.toFixed(2)}
                </Typography>
            </Box>
            <Box mt={4}>
                <Typography variant="h6">Products Bought:</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Crop Name</strong></TableCell>
                                <TableCell><strong>Total Sale Amount</strong></TableCell>
                                <TableCell><strong>Total Buy Amount</strong></TableCell>
                                <TableCell><strong>Total Receipts</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {summary?.productsSummary?.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>{product.cropName}</TableCell>
                                    <TableCell>₹{commafy(product.totalSaleAmount.toFixed(2))}</TableCell>
                                    <TableCell>₹{commafy(product.totalBuyAmount.toFixed(2))}</TableCell>
                                    <TableCell>{commafy(product.totalReceipts)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Paper>
    );
};

export default CustomerSummary;