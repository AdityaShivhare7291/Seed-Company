import Receipt from '../models/receipt.js';
import Customer from '../models/customers.js';
import Product from '../models/products.js';
import sequelize from '../models/dbConnection.js';
import Worker from '../models/workers.js';
import { isNumber } from '../utils.js';

class ReceiptController {

    // Create a new receipt
    async createReceipt(req, res) {
        const transaction = await sequelize.transaction(); // Start a transaction

        try {
            console.log("===== CREATE RECEIPT REQUEST STARTED =====");
            console.log("Incoming Request Body:", JSON.stringify(req.body, null, 2));

            let {
                name,
                address,
                phoneNo,
                lotNumber,
                customerId,
                workerId,
                accountId,
                products,
                amount,
                saleType,
                rate,
                discount,
                finalAmount,
                weightType,
                deduction,
                noOfBags,
                description,
                netWeight,
                parchiNo,
                truckNo,
                date
            } = req.body;

            deduction = deduction || 0;
            discount = discount || 0;
            description = description || "";

            // Step 1: Customer Lookup or Creation
            if (!customerId) {
                console.log("[Step 1] Searching for existing customer...");
                const customer = await Customer.findOne({
                    where: {
                        name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', name.toLowerCase()),
                        phoneNo: phoneNo,
                    },
                });

                if (!customer) {
                    console.log("[Step 1] No customer found. Creating new customer...");
                    const customerDetails = await Customer.create({
                        name,
                        address,
                        phoneNo,
                        custType: "normal",
                        amount: 0,
                        workerId
                    }, { transaction });
                    customerId = customerDetails.customerId;
                    console.log("[Step 1] New customer created:", customerDetails.toJSON());
                } else {
                    console.log("[Step 1] Customer found:", customer.toJSON());
                    customerId = customer.customerId;
                }
            }

            // Step 2: Required fields validation
            console.log("[Step 2] Validating required fields...");
            if (
                !customerId ||
                !workerId ||
                !products ||
                !isNumber(amount) ||
                !saleType ||
                !isNumber(rate) ||
                !isNumber(finalAmount) ||
                !weightType ||
                !isNumber(noOfBags) ||
                !parchiNo ||
                !truckNo
            ) {
                console.error("[Step 2] Missing required fields.");
                throw new Error("All required fields must be provided.");
            }

            // Step 3: Product Validation
            console.log("[Step 3] Extracting product IDs...");
            const cropIds = products.map(item => item._id);
            console.log("[Step 3] Product IDs:", cropIds);

            console.log("[Step 3] Fetching products from DB...");
            const productRecords = await Product.findAll({
                where: { cropId: cropIds },
                transaction
            });
            console.log("[Step 3] Products found in DB:", productRecords.map(p => p.toJSON()));

            if (!productRecords.length) {
                throw new Error("No products found for given IDs.");
            }

            const productMap = new Map();
            productRecords.forEach(p => productMap.set(p.cropId, p));

            console.log("[Step 3] Validating stock for each product...");
            for (const item of products) {
                const dbProduct = productMap.get(item._id);

                if (!dbProduct) {
                    throw new Error(`Product with cropId ${item._id} not found.`);
                }

                if (saleType === "Sale" && dbProduct.quantity < item.quantity) {
                    throw new Error(`Insufficient quantity for cropId ${item._id}`);
                }
                let newWeight;
                if (weightType === 'TON weight') {
                    const totalWeight = products.reduce((sum, item) => sum + item.quantity, 0);
                    const totalDeduction = (deduction * noOfBags)
                    // Step 2: Deduct ghatak wajan
                    netWeight = totalWeight - (totalDeduction || 0);
                    const proportion = totalWeight / item.quantity
                    newWeight = proportion * netWeight
                }

                if (saleType === "Sale") {
                    if (weightType === 'TON weight') {
                        dbProduct.quantity -= netWeight;
                    } else {
                        dbProduct.quantity -= item.quantity;
                    }
                    await dbProduct.save({ transaction });
                    console.log(`[Step 3] Updated stock for cropId ${item._id}: ${dbProduct.quantity}`);
                } else {
                    if (weightType === 'TON weight') {
                        dbProduct.quantity += netWeight;
                    } else {
                        dbProduct.quantity += item.quantity;
                    }
                    await dbProduct.save({ transaction });
                    console.log(`[Step 3] stock increased for cropId ${item._id}: ${dbProduct.quantity}`);
                }

            }

            // Step 4: Customer Fetch for Balance Update
            console.log("[Step 4] Fetching customer for balance update...");
            const customer = await Customer.findByPk(customerId, { transaction });
            if (!customer) {
                throw new Error("Customer not found.");
            }
            console.log("[Step 4] Customer before balance update:", customer.toJSON());

            if (saleType === "Sale" && productRecords[0].quantity < netWeight) {
                throw new Error("Insufficient product quantity for sale.");
            }

            // Step 5: Receipt Data Preparation
            console.log("[Step 5] Preparing receipt data...");
            const receiptData = {
                lotNumber: lotNumber || '1',
                customerId,
                workerId,
                accountId: accountId || '1',
                products,
                amount,
                saleType,
                rate,
                discount,
                finalAmount,
                weightType,
                deduction,
                noOfBags,
                date,
                status: "unpaid",
                description,
                netWeight,
                parchiNo,
                truckNo
            };
            console.log("[Step 5] Receipt data ready:", receiptData);

            // Step 6: Create Receipt
            console.log("[Step 6] Creating receipt...");
            const receipt = await Receipt.create(receiptData, { transaction });
            console.log("[Step 6] Receipt created:", receipt.toJSON());

            // Step 7: Update Customer Balance
            console.log("[Step 7] Updating customer balance...");
            if (saleType === "Sale") {
                customer.amount += parseFloat(finalAmount);
            } else if (saleType === "Buy" || saleType === "purchase") {
                customer.amount -= parseFloat(finalAmount);
            } else {
                throw new Error('Invalid saleType. It must be either "Sale" or "Buy".');
            }
            await customer.save({ transaction });
            console.log("[Step 7] Customer after balance update:", customer.toJSON());

            // Step 8: Commit Transaction
            console.log("[Step 8] Committing transaction...");
            await transaction.commit();
            console.log("===== CREATE RECEIPT COMPLETED SUCCESSFULLY =====");

            res.status(201).json({
                message: "Receipt created and customer balance updated successfully",
                receipt,
                customer,
            });
        } catch (error) {
            await transaction.rollback();
            console.error("===== CREATE RECEIPT FAILED =====");
            console.error("Error creating receipt and updating customer balance:", error);
            res.status(400).json({ error: error.message });
        }
    }


    //update receipt
    async updateReceipt(req, res) {
        const { receiptId, status, workerId } = req.body;
        try {
            await Receipt.update({ status, workerId }, { where: { receiptId } });
            res.status(200).json({ message: 'Status updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update status' });
        }
    };

    // Get all receipts
    async getReceipts(req, res) {
        try {
            const receipts = await Receipt.findAll();
            res.status(200).json(receipts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get a receipt by ID
    async getReceiptById(req, res) {
        try {
            const { id } = req.params;
            const receipt = await Receipt.findByPk(id);
            if (!receipt) {
                return res.status(404).json({ error: 'Receipt not found' });
            }
            res.status(200).json(receipt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getReceiptByCustomerId(req, res) {
        try {
            const { customerId } = req.query;

            // Step 1: Fetch receipts with worker details
            const receipts = await Receipt.findAll({
                where: { customerId },
                order: [['date', 'DESC']],
                include: [
                    {
                        model: Worker,
                        attributes: ['workerId', 'name', 'role'],
                    },
                ],
            });

            // Step 2: Collect all product IDs from the receipts JSON
            const productIds = [
                ...new Set(receipts.flatMap(r => r.products.map(p => p._id)))
            ];

            console.log("productIds", productIds)

            // Step 3: Fetch product details
            const products = await Product.findAll({
                where: { cropId: productIds },
                attributes: ['cropId', 'cropName', 'variety'],
            });

            console.log("products", products)


            // Step 4: Create lookup map for quick access
            const productMap = new Map(products.map(p => [p.cropId, p.toJSON()]));

            // Step 5: Merge product details into receipts
            const receiptsWithProductDetails = receipts.map(receipt => ({
                ...receipt.toJSON(),
                products: receipt.products.map(p => ({
                    ...p,
                    details: productMap.get(p._id) || null
                }))
            }));

            // Send final response
            res.status(200).json(receiptsWithProductDetails);
        } catch (error) {
            console.error("error caught in receipt id", error);
            res.status(500).json({ error: error.message });
        }
    }


    async getReceiptByAccountId(req, res) {
        try {
            const { accountId } = req.query;
            console.log({ accountId })
            const receipts = await Receipt.findAll({
                where: { accountId },
                order: [['date', 'DESC']], // Order receipts by date descending
                include: [
                    {
                        model: Product, // Assuming your model is called 'Product'
                        attributes: ['cropId', 'cropName', 'variety'], // Include the necessary attributes of the product
                    },
                    {
                        model: Worker, // Assuming your model is called 'Worker'
                        attributes: ['workerId', 'name', 'role'], // Include the necessary attributes of the worker
                    },
                    {
                        model: Customer,
                        attributes: ['customerId', 'name']
                    }
                ],
            });
            res.status(200).json(receipts);
        } catch (error) {
            console.log("error caught in receipt id", error)
            res.status(500).json({ error: error.message });
        }
    }


    // Delete a receipt
    async deleteReceipt(req, res) {
        try {
            const { id } = req.params;
            const receipt = await Receipt.findByPk(id);
            if (!receipt) {
                return res.status(404).json({ error: 'Receipt not found' });
            }
            await receipt.destroy();
            res.status(200).json({ message: 'Receipt deleted successfully.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ReceiptController();
