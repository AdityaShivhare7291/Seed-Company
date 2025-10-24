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
    Button,
    Select,
    MenuItem,
    TextField,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { commafy } from 'commafy-anything';

const ReceiptTable = ({ customerId, customer }) => {
    const navigate = useNavigate();
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [receiptIdSearch, setReceiptIdSearch] = useState('');
    const [saleTypeSearch, setSaleTypeSearch] = useState('');
    const [amountSearch, setAmountSearch] = useState('');
    const [lotNumberSearch, setLotNumberSearch] = useState('');
    const userDetails = useSelector((state) => state.user.userDetails);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/receipt/customerId?customerId=${customerId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching receipts: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("receipts update", { data })
                setReceipts(data);
                setFilteredReceipts(data);  // Initially, display all receipts
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, [customerId]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddReceipt = () => {
        navigate('/imageReceipt', { state: { customerId } });
    };

    const handleStatusChange = async (receiptId, newStatus) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/receipt/updateStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receiptId, status: newStatus, workerId: userDetails.workerId }),
            });


            if (!response.ok) {
                throw new Error(`Error updating status: ${response.statusText}`);
            }

            // Update local state
            setReceipts((prevReceipts) =>
                prevReceipts.map((receipt) =>
                    receipt.receiptId === receiptId ? { ...receipt, status: newStatus } : receipt
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSearch = () => {
        const filtered = receipts.filter((receipt) =>
            (receiptIdSearch === '' || receipt.receiptId.toString().includes(receiptIdSearch)) &&
            (saleTypeSearch === '' || receipt.saleType.toLowerCase().includes(saleTypeSearch.toLowerCase())) &&
            (amountSearch === '' || receipt.amount.toString().includes(amountSearch)) &&
            (lotNumberSearch === '' || receipt.lotNumber.toString().includes(lotNumberSearch))
        );

        setFilteredReceipts(filtered);
        setPage(0);  // Reset to the first page after search
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

    if (filteredReceipts.length === 0) {
        return (
            <>
                <Typography variant="h6" align="center">
                    No receipts found for this customer.
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '16px' }}>
                    <Button variant="contained" color="primary" onClick={handleAddReceipt}>
                        Add Receipt
                    </Button>
                </div>
            </>
        );
    }

    const displayedReceipts = filteredReceipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // For a single receipt
    const cropNames = (receipt) => receipt.products[0].details.cropName

    return (
        <TableContainer component={Paper} elevation={3}>
            <Typography variant="h6" align="center">
                Receipts for Customer: {customer.name}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '16px' }}>
                <Button variant="contained" color="primary" onClick={handleAddReceipt}>
                    Add Receipt
                </Button>
            </div>

            <Grid container spacing={2} style={{ padding: '16px' }}>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Receipt ID"
                        variant="outlined"
                        value={receiptIdSearch}
                        onChange={(e) => setReceiptIdSearch(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Sale Type"
                        variant="outlined"
                        value={saleTypeSearch}
                        onChange={(e) => setSaleTypeSearch(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Amount"
                        variant="outlined"
                        value={amountSearch}
                        onChange={(e) => setAmountSearch(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Lot Number"
                        variant="outlined"
                        value={lotNumberSearch}
                        onChange={(e) => setLotNumberSearch(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginBottom: '16px' }}>
                Search
            </Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Receipt ID</TableCell>
                        <TableCell>Lot Number</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Buy OR Sell</TableCell>
                        <TableCell>Net Weight</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Worker Details</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Rate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayedReceipts.map((receipt) => (
                        <TableRow key={receipt.receiptId}>
                            <TableCell>{receipt.receiptId}</TableCell>
                            <TableCell>{receipt.lotNumber}</TableCell>
                            <TableCell
                                style={{
                                    color: receipt.saleType === 'Buy' ? 'red' : receipt.saleType === 'Sale' ? 'green' : 'black',
                                }}
                            >
                                {commafy(receipt.amount.toFixed(2))}
                            </TableCell>
                            <TableCell
                                style={{
                                    color: receipt.saleType === 'Buy' ? 'red' : receipt.saleType === 'Sale' ? 'green' : 'black',
                                }}
                            >
                                {receipt.saleType}
                            </TableCell>
                            <TableCell>{commafy(receipt.netWeight)}</TableCell>
                            <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                            <TableCell>{receipt.Worker.name}</TableCell>
                            <TableCell>{cropNames(receipt)}</TableCell>
                            <TableCell>{receipt.rate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                count={filteredReceipts.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </TableContainer>
    );
};

export default ReceiptTable;
