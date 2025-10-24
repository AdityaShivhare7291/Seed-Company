import React, { useState, useEffect } from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { commafy } from 'commafy-anything';

const TransactionHistory = ({ accountId }) => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of transactions per page

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/transaction/getAllTransactionOfAccount`, {
                    params: { accountId },
                });
                console.log("transaction history", { data: response.data });
                setTransactions(response.data);
                setFilteredTransactions(response.data); // Initially, all transactions are shown
            } catch (err) {
                setError(err.message || 'Failed to fetch transactions');
            } finally {
                setLoading(false);
            }
        };

        if (accountId) fetchTransactions();
    }, [accountId]);

    useEffect(() => {



        // Filter transactions based on the search term
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = transactions.filter(transaction =>
            transaction?.Customer?.name.toLowerCase().includes(lowercasedSearchTerm) ||
            transaction.transactionType.toLowerCase().includes(lowercasedSearchTerm) ||
            transaction.paymentMode.toLowerCase().includes(lowercasedSearchTerm) ||
            transaction.description.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredTransactions(filtered);
        setCurrentPage(1); // Reset to the first page on search
    }, [searchTerm, transactions]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return <Typography variant="h6">Loading transactions...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>;
    }

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Transaction History
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by customer, type, etc."
                    sx={{ width: '50%' }}
                />
                <Button onClick={() => navigate("/customer/addTransaction", { state: { customerId: "-1" } })}>
                    Add Transaction
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Transaction Made</strong></TableCell>
                            <TableCell><strong>Customer</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Payment Mode</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedTransactions.map((transaction) => (
                            <TableRow key={transaction.transactionId}>
                                <TableCell
                                    style={{
                                        color: transaction.transactionType === 'debit' ? 'red' : transaction.transactionType === 'credit' ? 'green' : 'black',
                                    }}
                                >
                                    {transaction.transactionType}
                                </TableCell>
                                <TableCell>{transaction.Worker.name}</TableCell>

                                <TableCell>{transaction?.Customer?.name ?? "Self"}</TableCell>

                                <TableCell
                                    style={{
                                        color: transaction.transactionType === 'debit' ? 'red' : transaction.transactionType === 'credit' ? 'green' : 'black',
                                    }}
                                >
                                    ${commafy(transaction.amount.toFixed(2))}
                                </TableCell>
                                <TableCell>
                                    {new Date(transaction.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{transaction.paymentMode}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Button
                    variant="outlined"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <Typography variant="body1" sx={{ mx: 2 }}>
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button
                    variant="outlined"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </Paper>
    );
};

export default TransactionHistory;
