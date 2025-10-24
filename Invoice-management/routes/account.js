import express from 'express';
import AccountController from '../controller/account.js'; // Adjust the path accordingly

const router = express.Router();

router.post('/accounts', AccountController.createAccount);
router.get('/accounts', AccountController.getAccounts);
router.get('/accounts/:id', AccountController.getAccountById);
router.put('/accounts/:id', AccountController.updateAccount);
router.delete('/accounts/:id', AccountController.deleteAccount);

export default router;
