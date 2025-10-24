import Product from '../models/products.js'; // Assuming your Product model is in the models folder

class ProductController {
    // Insert a single product
    async createProduct(req, res) {
        const { cropId, cropName, Variety, quantity } = req.body;

        try {
            const product = await Product.create({
                cropId,
                cropName,
                Variety,
                quantity
            });

            return res.status(201).json({
                message: 'Product created successfully',
                product,
            });
        } catch (error) {
            console.error('Error creating product:', error);
            return res.status(500).json({ message: 'Error creating product', error });
        }
    }

    // Insert multiple products
    async createProducts(req, res) {
        const products = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Invalid input, expected an array of products.' });
        }

        try {
            const createdProducts = await Product.bulkCreate(products);

            return res.status(201).json({
                message: 'Products created successfully',
                products: createdProducts,
            });
        } catch (error) {
            console.error('Error creating products:', error);
            return res.status(500).json({ message: 'Error creating products', error });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll(); // Fetch all products from the database
            console.log({ products })
            return res.status(200).json(products); // Return products (empty array or filled)
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching products', error: error.message }); // Handle errors
        }
    }
}

export default new ProductController();
