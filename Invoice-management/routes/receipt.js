import express from 'express';
import ReceiptController from '../controller/receipt.js';

const router = express.Router();

// Define routes
router.post('/', ReceiptController.createReceipt);
router.get('/customerId', ReceiptController.getReceiptByCustomerId)

router.get('/accountId', ReceiptController.getReceiptByAccountId)
router.post('/updateStatus', ReceiptController.updateReceipt)
router.get('/', ReceiptController.getReceipts);
router.get('/:id', ReceiptController.getReceiptById);
router.put('/:id', ReceiptController.updateReceipt);
router.delete('/:id', ReceiptController.deleteReceipt);

export default router;
