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
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setProducts } from '../store/slice/ProductSlice';
import { commafy } from 'commafy-anything';

const StockTable = () => {
    const [products, setProductys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch all products with their stock information
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/products/products`);
                if (!response.ok) {
                    throw new Error(`Error fetching products: ${response.statusText}`);
                }
                const data = await response.json();
                console.log({ data })
                setProductys(data);
                dispatch(setProducts(data));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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

    if (products.length === 0) {
        return (
            <Typography variant="h6" align="center">
                No products found in stock.
            </Typography>
        );
    }

    const displayedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <div className="col-span-10 p-6 ml-12 mr-12">
            <TableContainer component={Paper} elevation={3}>
                <Typography variant="h6" align="center" style={{ margin: '16px 0' }}>
                    Stock Overview
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Crop ID</TableCell>
                            <TableCell>Crop Name</TableCell>
                            <TableCell>Variety</TableCell>
                            <TableCell>Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedProducts.map((product) => (
                            <TableRow key={product.cropId}>
                                <TableCell>{product.cropId}</TableCell>
                                <TableCell>{product.cropName}</TableCell>
                                <TableCell>{product.Variety}</TableCell>
                                <TableCell>{commafy(product.quantity.toFixed(2))}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={products.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>
        </div>
    );
};

export default StockTable;
