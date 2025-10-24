import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Link to navigate to transaction history
import AccountPage from '../pages/AccountPage';
import { useNavigate } from 'react-router-dom';
import { commafy } from 'commafy-anything';

const AccountCard = ({ account }) => {
    const navigate = useNavigate();
    const {
        name = 'Default Name',
        phoneNo = 'N/A',
        amountInCash = 0,
        amountInBank = 0,
        accountId,
    } = account;

    const navigateTo = () => {
        navigate('/accountPageList', { state: { account } })
    }

    console.log("Data needs to be entered", commafy(account.amountInBank))

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Account Name: <strong>{name}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
                Phone Number: <strong>{phoneNo}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
                Amount in Cash: <strong>${commafy(amountInCash.toFixed(2))}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
                Amount in Bank: <strong>${commafy(amountInBank.toFixed(2))}</strong>
            </Typography>
            <Box textAlign="center">

                <Button onClick={() => navigateTo()} variant="contained" color="primary">
                    View Details
                </Button>

            </Box>
        </Paper>
    );
};

export default AccountCard;
