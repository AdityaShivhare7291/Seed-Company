import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slice/AccountSlice.js';
import customerReducer from './slice/CustomerSlice';
import transactionReducer from './slice/TransactionSlice.js';
import receiptReducer from './slice/ReceiptSlice';
import workerReducer from './slice/WorkerSlice';
import authReducer from './slice/AuthSlice';
import productReducer from './slice/ProductSlice.js'
import userReducer from './slice/userSlice.js'

const store = configureStore({
  reducer: {
    account: accountReducer,
    customer: customerReducer,
    transaction: transactionReducer,
    receipt: receiptReducer,
    worker: workerReducer,
    auth: authReducer,
    products: productReducer,
    user: userReducer
  },
});

export default store;
