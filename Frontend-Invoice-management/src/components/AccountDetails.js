import React from 'react';
import { Paper, Typography } from '@mui/material';
import { commafy } from 'commafy-anything';

const AccountDetails = ({ account }) => {
    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Account Name: <strong>{account.name}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
                Phone Number: <strong>{account.phoneNo}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
                Address: <strong>{account.address || 'N/A'}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
                Amount in Cash: <strong>${commafy(parseInt(account.amountInCash))}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
                Amount in Bank: <strong>${commafy(parseInt(account.amountInBank))}</strong>
            </Typography>
        </Paper>
    );
};

export default AccountDetails;
