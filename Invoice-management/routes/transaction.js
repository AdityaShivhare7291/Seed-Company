import express from 'express';
import TransactionController from '../controller/transaction.js';

const router = express.Router();

// Define routes
router.post('/', TransactionController.createTransaction);
router.get('/getAllTransactionOfCustomer', TransactionController.getTransactionByCustomerId)
router.get('/getAllTransactionOfAccount', TransactionController.getTransactionByAccountId)

export default router;
