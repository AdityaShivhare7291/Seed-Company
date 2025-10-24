import React, { useState } from 'react';
import { Tabs, Tab, Typography, Box, Grid, Paper } from '@mui/material';
import CustomReceipt from '../components/CustomerReceiptList'
import TransactionReceipt from '../components/TransactionReceiptList'
import Summary from "../components/Summary"
import { useLocation } from 'react-router-dom';

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
const customer = {}

const TabbedPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const { state } = useLocation();  // Get passed props from state
    const { customer } = state || {};  // Destructure the customer object
    console.log("Tabbedpage", { customer })

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div className="col-span-10 p-6 ml-12 mr-12">
            <Box sx={{ width: '100%' }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Dashboard
                    </Typography>
                    <Grid item xs={12} md={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Customer Name: <strong>{customer?.name ?? "Aditya"}</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Phone Number: <strong>{customer?.phoneNo ?? "626433942"}</strong>
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Address: <strong>{customer?.address ?? 'N/A'}</strong>
                            </Typography>
                        </Paper>
                    </Grid>
                </Paper>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Paper elevation={2}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                textColor="primary"
                                indicatorColor="primary"
                                aria-label="dashboard tabs"
                            >
                                <Tab label="Receipt" />
                                <Tab label="Transaction" />
                                <Tab label="Summary" />
                            </Tabs>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <TabPanel value={activeTab} index={0}>
                                <CustomReceipt customerId={customer.customerId} customer={customer} />
                                {/* Add Receipt content */}
                            </TabPanel>

                            <TabPanel value={activeTab} index={1}>
                                <TransactionReceipt customerId={customer.customerId} customer={customer} />
                            </TabPanel>

                            <TabPanel value={activeTab} index={2}>
                                <Summary customerId={customer.customerId} customer={customer} />
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TabbedPage;
