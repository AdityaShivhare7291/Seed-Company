import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination } from '@mui/material';
import { commafy } from 'commafy-anything';

const AccountReceipts = ({ accountId }) => {
    const [receipts, setReceipts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await fetch(
                    `/api/receipt/accountId?accountId=${accountId}`
                );
                const result = await response.json();
                console.log("account receipts", { result })
                if (Array.isArray(result)) {
                    setReceipts(result);
                } else {
                    console.error('Invalid data format received', result);
                    setReceipts([]);
                }
            } catch (error) {
                console.error('Failed to fetch receipts:', error);
                setReceipts([]);
            }
        };

        fetchReceipts();
    }, [accountId]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const currentReceipts = receipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Account Receipts
            </Typography>
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
                        {currentReceipts.length > 0 ? (
                            currentReceipts.map((receipt) => (
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
                                    }}>${commafy(receipt.finalAmount.toFixed(2))}</TableCell>
                                    <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {receipt.netWeight ? commafy(receipt.netWeight) : 'N/A'}
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
            <TablePagination
                component="div"
                count={receipts.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </Paper>
    );
};

export default AccountReceipts;
