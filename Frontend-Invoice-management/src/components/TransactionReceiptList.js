import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Box,
    TablePagination,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { commafy } from 'commafy-anything';

const TransactionTable = ({ customerId, customer }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch transactions for a specific customer ID
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/transaction/getAllTransactionOfCustomer?customerId=${customerId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching transactions: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("trnasaction list", { data })
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [customerId]);

    const handleAddTransactionReceipt = () => {
        navigate('/customer/addTransaction', { state: { customerId } })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

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

    if (transactions.length === 0) {
        return (
            <>
                <Typography variant="h6" align="center">
                    No transactions found for this customer.
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '16px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddTransactionReceipt}
                    >
                        Add Transaction
                    </Button>
                </div>
            </>

        );
    }

    const displayedTransactions = transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <TableContainer component={Paper} elevation={3}>
            <Typography variant="h6" align="center" sx={{ padding: 2 }}>
                Transactions for Customer : {customer?.name}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTransactionReceipt}
                >
                    Add Transaction Receipt
                </Button>
            </div>
            <Table>

                <TableHead>
                    <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Worker Details</TableCell>
                        <TableCell>Payment Mode</TableCell>
                        <TableCell>Transaction Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayedTransactions.map((transaction) => (
                        <TableRow key={transaction.transactionId}>
                            <TableCell>{transaction.transactionId}</TableCell>
                            <TableCell>{transaction.Worker.name}</TableCell>
                            <TableCell>{transaction.paymentMode}</TableCell>
                            <TableCell style={{
                                color: transaction.transactionType === 'debit' ? 'red' : transaction.transactionType === 'credit' ? 'green' : 'black',
                            }}>{transaction.transactionType}</TableCell>
                            <TableCell
                                style={{
                                    color: transaction.transactionType === 'debit' ? 'red' : transaction.transactionType === 'credit' ? 'green' : 'black',
                                }}
                            >{commafy(transaction.amount)}</TableCell>
                            <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={transactions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </TableContainer>
    );
};

export default TransactionTable;
