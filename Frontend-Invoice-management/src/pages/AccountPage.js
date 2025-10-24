import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Tab, Tabs, CircularProgress } from '@mui/material';
import AccountDetails from '../components/AccountDetails'; // Component to display account info
import TransactionHistory from '../components/TransactionHistory'; // Component for transaction history
import AccountReceipts from '../components/AccountReceipts'; // Component to display receipts
import { useLocation } from 'react-router-dom';
import { commafy } from 'commafy-anything';

const TabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const AccountPage = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state to show spinner while fetching data
    const [error, setError] = useState(null); // Error state


    const { state } = useLocation();  // Get passed props from state
    const { account } = state || {};  // Destructure the customer object
    console.log({ account })

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

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

    // Destructuring with default values to avoid undefined property errors
    const {
        name = 'Default Name',
        phoneNo = 'N/A',
        address = 'N/A',
        amountInCash = 0,
        amountInBank = 0,
        accountId,
    } = account || {}; // Default values in case account is undefined

    return (
        <div className="col-span-10 p-6 ml-12 mr-12">
            <Box sx={{ width: '100%' }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Account Details
                    </Typography>
                </Paper>

                <Grid container spacing={3}>
                    {/* Account Details Section */}
                    <Grid item xs={12} md={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Account Name: <strong>{name}</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Phone Number: <strong>{phoneNo}</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Address: <strong>{address}</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Amount in Cash: <strong>${commafy(amountInCash.toFixed(2))}</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Amount in Bank: <strong>${commafy(amountInBank.toFixed(2))}</strong>
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Tabs Section */}
                    <Grid item xs={12}>
                        <Paper elevation={2}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                textColor="primary"
                                indicatorColor="primary"
                                aria-label="account details tabs"
                            >
                                <Tab label="Account Info" />
                                <Tab label="Transactions" />
                                <Tab label="Receipts" />
                            </Tabs>
                        </Paper>
                    </Grid>

                    {/* Tab Panels */}
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <TabPanel value={activeTab} index={0}>
                                <AccountDetails account={account} />
                            </TabPanel>

                            <TabPanel value={activeTab} index={1}>
                                <TransactionHistory accountId={accountId} />
                            </TabPanel>

                            <TabPanel value={activeTab} index={2}>
                                <AccountReceipts accountId={accountId} />
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default AccountPage;
