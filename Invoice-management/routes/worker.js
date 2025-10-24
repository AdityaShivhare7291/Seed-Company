import express from 'express';
const app = express();
import workerAuthentication from '../controller/worker.js';

// ''''''''''''making sign up request

app.get('/json', workerAuthentication.getData);

app.post('/signup', workerAuthentication.signup);

app.post('/login', workerAuthentication.login);

app.post('/getAllData', workerAuthentication.getAllDataOfDay)

export default app;
