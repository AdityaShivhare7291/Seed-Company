import express from 'express';
import ProductController from '../controller/product.js'; // Import the controller

const router = express.Router();

// Route for creating a single product
router.post('/create', ProductController.createProduct);

// Route for creating multiple products
router.post('/bulk-create', ProductController.createProducts);

// Route to get all products
router.get('/products', ProductController.getAllProducts);

export default router;
