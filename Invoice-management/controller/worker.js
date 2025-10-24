import Receipt from '../models/receipt.js';
import Transaction from '../models/transaction.js';
import Product from '../models/products.js';
import Worker from '../models/workers.js';
import { Op } from 'sequelize';
import Customer from '../models/customers.js';
import Account from '../models/accounts.js';

class workerAuth {
  signup = async (req, res) => {
    try {
      const { name, password, address, phoneNo, profileUrl, role } = req.body;

      if (!name || !password || !address || !phoneNo || !profileUrl) {
        return res.status(403).send({ message: 'Arguements are not passed ' });
      }

      const registerUser = await Worker.create({
        name,
        password,
        address,
        phoneNo,
        profileUrl,
        role
      });
      res.status(200).send(registerUser);
      console.log('User registered: ', registerUser);
    } catch (err) {
      console.log('Signup Error: ', err);
      res.status(500).send('Error during registration');
    }
  };

  login = async (req, res) => {
    let workerAuthCheck;
    try {
      console.log({ loginDetails: req.body })
      const { name, password } = req.body;

      if (!name || !password) {
        return res.status(403).send({ message: 'Arguements are not passed' });
      }
      const worker = await Worker.findOne({
        where: {
          name,
          password,
        },
      });

      console.log('WORKER: ', worker);
      if (worker) {
        res.send(worker);
        workerAuthCheck = worker;
      } else {
        res.status(401).send('Invalid Credentials');
        workerAuthCheck = null;
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  };

  getData = (req, res) => res.status(200).json({ success: true });

  getAllDataOfDay = async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const startDateTime = new Date(startDate + "T00:00:00Z");
      const endDateTime = new Date(endDate + "T23:59:59Z");

      console.log(`[${new Date().toISOString()}] Fetching receipts between ${startDateTime} and ${endDateTime}`);

      // Fetch receipts with Worker and Customer
      const receipts = await Receipt.findAll({
        where: {
          date: {
            [Op.between]: [startDateTime, endDateTime],
          },
        },
        include: [
          { model: Worker, attributes: ["name"] },
          { model: Customer, attributes: ["name"] },
        ],
      });
      console.log(`[${new Date().toISOString()}] Fetched ${receipts.length} receipts`);

      // Collect unique product IDs
      const productIdsSet = new Set();
      receipts.forEach((receipt, idx) => {
        const products = receipt.products || [];
        console.log(`[${new Date().toISOString()}] Receipt ${idx + 1} has ${products.length} products`);
        products.forEach((p) => {
          if (p._id) {
            productIdsSet.add(p._id);
            console.log(`[${new Date().toISOString()}] Found product ID: ${p._id}`);
          }
        });
      });

      const productIds = Array.from(productIdsSet);
      console.log(`[${new Date().toISOString()}] Unique product IDs collected:`, productIds);

      // If no product IDs, just return empty receipts with transactions
      if (productIds.length === 0) {
        console.log(`[${new Date().toISOString()}] No product IDs found in receipts.`);
      }

      // Query Product details for unique product IDs
      const productsDetails = await Product.findAll({
        where: {
          cropId: {
            [Op.in]: productIds,
          },
        },
        attributes: ["cropId", "cropName"],
      });
      console.log(`[${new Date().toISOString()}] Fetched product details count: ${productsDetails.length}`);

      // Create lookup map for cropName
      const productMap = {};
      productsDetails.forEach((prod) => {
        productMap[prod.cropId] = prod.cropName;
        console.log(`[${new Date().toISOString()}] Mapping product ID ${prod.cropId} to cropName "${prod.cropName}"`);
      });

      // Enrich receipts with cropName
      const enrichedReceipts = receipts.map((receipt, idx) => {
        const products = receipt.products || [];
        const enrichedProducts = products.map((p) => ({
          ...p,
          cropName: productMap[p._id] || null,
        }));

        console.log(`[${new Date().toISOString()}] Enriched receipt ${idx + 1} with product crop names`);

        return {
          ...receipt.toJSON(),
          products: enrichedProducts,
        };
      });

      // Fetch transactions with related models
      const transactions = await Transaction.findAll({
        where: {
          date: {
            [Op.between]: [startDateTime, endDateTime], // Use Date objects for consistency
          },
        },
        include: [
          { model: Customer, attributes: ["name"] },
          { model: Worker, attributes: ["name"] },
          { model: Account, attributes: ["name"] },
        ],
        order: [["date", "ASC"]],
      });
      console.log(`[${new Date().toISOString()}] Fetched ${transactions.length} transactions`);

      // Return both receipts and transactions in an object
      return res.json({
        receipts: enrichedReceipts,
        transactions,
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching data:`, error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

}

export default new workerAuth();
