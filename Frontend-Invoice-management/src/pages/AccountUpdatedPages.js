import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Pagination } from '@mui/material';
import AccountCard from '../components/AccountCard'; // A component to display individual account details

const AccountPage = () => {
    const [accounts, setAccounts] = useState([]); // State to store all account data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [currentPage, setCurrentPage] = useState(1); // State for the current page
    const itemsPerPage = 6; // Number of items per page

    useEffect(() => {
        // Fetch all accounts data from API
        const fetchAccountsData = async () => {
            try {
                const response = await fetch('/api/accounts/accounts');
                const data = await response.json();
                if (data && data.data && data.data.length > 0) {
                    setAccounts(data.data); // Set the accounts list
                } else {
                    setError('No accounts data found.');
                }
            } catch (err) {
                setError('Failed to fetch accounts data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAccountsData();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value); // Update current page
    };

    // Calculate the accounts to display based on the current page
    const indexOfLastAccount = currentPage * itemsPerPage;
    const indexOfFirstAccount = indexOfLastAccount - itemsPerPage;
    const currentAccounts = accounts.slice(indexOfFirstAccount, indexOfLastAccount);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <div className="col-span-10 p-8 mx-12 bg-gray-50 rounded-lg shadow-lg">
            <Box sx={{ width: '100%' }}>
                {/* Header Section */}
                <Paper
                    elevation={3}
                    sx={{ p: 4, mb: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}
                    >
                        Accounts List
                    </Typography>
                </Paper>

                {/* Accounts Grid */}
                <Grid container spacing={4} sx={{ px: 2 }}>
                    {currentAccounts.map((account) => (
                        <Grid item xs={12} sm={6} md={4} key={account.accountId}>
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 3, bgcolor: 'white', borderRadius: 3, transition: '0.3s',
                                    '&:hover': { transform: 'scale(1.03)', boxShadow: '0px 8px 20px rgba(0,0,0,0.15)' }
                                }}
                            >
                                <AccountCard account={account} />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Pagination Section */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={Math.ceil(accounts.length / itemsPerPage)} // Calculate total pages
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ button: { fontWeight: 'bold' } }}
                    />
                </Box>
            </Box>
        </div>
    );
};

export default AccountPage;
