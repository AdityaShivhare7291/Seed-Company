import express from 'express';
const app = express();
import customerAuthentication from '../controller/customer.js';

app.get('/json', customerAuthentication.getData);

app.post('/signup', customerAuthentication.signup);

app.post('/login', customerAuthentication.login);

app.get('/getCustomerDetails', customerAuthentication.getCustomDetailsByCustomerId)

app.get('/getAllCustomers', customerAuthentication.getAllCustomer);

app.get('/getCustomerSummary', customerAuthentication.getCustomerSummary);

export default app;
