import Customer from '../models/customers.js';
import Transaction from '../models/transaction.js';
import Receipt from '../models/receipt.js';
import Product from '../models/products.js';
import sequelize from '../models/dbConnection.js';
import Worker from '../models/workers.js';

class customerAuth {
  signup = async (req, res) => {
    try {
      const { name, address, phoneNo, custType, workerId, amount } = req.body;

      console.log({ data: req.body })
      if (!name || !workerId || !address || !phoneNo || !custType) {
        return res.status(403).send({ message: 'Arguements are not passed ' });
      }

      const customer = await Customer.findOne({
        where: {
          name,
          phoneNo,
        },
      });

      if (customer) {
        throw new Error("user already gets registered")
      }

      const registerCust = await Customer.create({
        name,
        address,
        phoneNo,
        custType,
        amount,
        workerId
      });

      res.status(200).send(registerCust);
      console.log('Customer registered: ', registerCust);
    } catch (err) {
      console.log('Signup Error: ', err);
      res.status(500).send('Error during registration');
    }
  };

  login = async (req, res) => {
    let custAuthCheck;
    try {
      const { name, phoneNo } = req.body;
      const customer = await Customer.findOne({
        where: {
          name: name,
          phoneNo: phoneNo,
        },
      });

      console.log('CUSTOMER: ', customer);
      if (customer) {
        res.send(customer);
        custAuthCheck = customer;
      } else {
        res.status(401).send('Invalid Credentials');
        custAuthCheck = null;
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  };

  getCustomDetailsByCustomerId = async (req, res) => {
    try {
      console.log("htting customerDetials")
      const { customerId } = req.query;
      const customerDetails = await Customer.findByPk(customerId);
      res.status(200).json(customerDetails)
    } catch (e) {
      console.error(e)
    }
  }

  getAllCustomer = async (req, res) => {
    try {
      const customers = await Customer.findAll({
        include: [
          {
            model: Worker, // Assuming your model is called 'Worker'
            attributes: ['workerId', 'name', 'role'], // Include the necessary attributes of the worker
          },
        ],
      }); // Fetch customers from DB
      res.status(200).json(customers);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Error fetching customers", error });
    }
  }


  getCustomerSummary = async (req, res) => {
    try {
      const { customerId } = req.query;

      // 1️⃣ Calculate total credit
      const totalCredit = await Transaction.sum("amount", {
        where: { customerId, transactionType: "credit" }
      });

      // 2️⃣ Calculate total debit
      const totalDebit = await Transaction.sum("amount", {
        where: { customerId, transactionType: "debit" }
      });

      // 3️⃣ Fetch all receipts for the customer
      const receipts = await Receipt.findAll({
        where: { customerId },
        attributes: ["saleType", "finalAmount", "products"],
        raw: true
      });

      // 4️⃣ Aggregate product stats
      const productStatsMap = new Map();

      receipts.forEach(receipt => {
        const parsed = JSON.parse(receipt?.products)

        const key = receipt._id;
        if (!productStatsMap.has(key)) {
          productStatsMap.set(key, {
            productId: key,
            cropId: parsed[0]._id,
            totalSaleAmount: 0,
            totalBuyAmount: 0,
            totalReceipts: 0
          });
        }

        const stats = productStatsMap.get(key);

        if (receipt.saleType === "Sale") {
          stats.totalSaleAmount += receipt.finalAmount;
        } else if (receipt.saleType === "Buy") {
          stats.totalBuyAmount += receipt.finalAmount;
        }

        stats.totalReceipts += 1;
      });

      // Create a Set to store unique cropIds
      const cropIdSet = new Set();

      Array.from(productStatsMap.keys()).forEach(productId => {
        const productData = productStatsMap.get(productId);
        if (productData?.cropId) {
          cropIdSet.add(productData.cropId); // Add to Set (auto handles uniqueness)
        }
      });

      const uniqueCropIds = Array.from(cropIdSet);

      const productDetails = await Product.findAll({
        where: { cropId: uniqueCropIds },
        attributes: ["cropId", "cropName"],
        raw: true
      });

      // 6️⃣ Merge product names with stats
      const productsSummary = Array.from(productStatsMap.values()).map(stats => {
        const details = productDetails.find(p => p.cropId === stats.cropId);
        return {
          ...stats,
          cropName: details?.cropName || null
        };
      });

      // 7️⃣ Send response
      return res.status(200).json({
        totalCredit: totalCredit || 0,
        totalDebit: totalDebit || 0,
        productsSummary
      });

    } catch (error) {
      console.log({ message: "Error fetching customer summary", error: error.message });
      res.status(500).json({ error: error.message });
    }
  };


  getData = (req, res) => res.status(200).json({ success: true });
}

export default new customerAuth();
