import Transaction from '../models/transaction.js';
import Customer from '../models/customers.js';
import Worker from '../models/workers.js';
import Account from '../models/accounts.js'
import sequelize from '../models/dbConnection.js';

// Controller Class for Transactions
class TransactionController {
    // Create a new transaction
    async createTransaction(req, res) {
        const transactionStart = await sequelize.transaction(); // Start a transaction
        try {
            let {
                customerId,
                voucherNo,
                accountId,
                workerId,
                paymentMode,
                transactionType,
                amount,
                description,
                date
            } = req.body;

            // Validate input
            if (!['credit', 'debit'].includes(transactionType)) {
                throw new Error('Invalid transaction type. Must be "credit" or "debit".');
            }
            if (!['Cash', 'Bank'].includes(paymentMode)) {
                throw new Error('Invalid payment mode. Must be "Cash" or "Bank".');
            }
            if (amount <= 0) {
                throw new Error('Transaction amount must be greater than 0.');
            }

            if (!description) {
                description = ""
            }

            // Create the transaction record
            const transaction = await Transaction.create(
                {
                    customerId: customerId === '-1' ? null : customerId,
                    accountId,
                    workerId,
                    paymentMode,
                    voucherNo,
                    transactionType,
                    amount,
                    description,
                    date: new Date(date)
                },
                { transaction: transactionStart }
            );

            // Fetch associated customer and account
            // Check if customerId is valid
            if (customerId !== '-1') {
                const customer = await Customer.findByPk(customerId, { transaction: transactionStart });
                if (!customer) {
                    throw new Error('Customer not found.');
                }

                // Update customer balance based on transaction type
                if (transactionType === 'credit') {
                    customer.amount = parseFloat(customer.amount) - parseFloat(amount);
                } else if (transactionType === 'debit') {
                    customer.amount = parseFloat(customer.amount) + parseFloat(amount);
                }

                // Save the updated customer balance
                await customer.save({ transaction: transactionStart });
            }

            // Fetch the account
            const account = await Account.findByPk(accountId, { transaction: transactionStart });
            if (!account) {
                throw new Error('Account not found.');
            }

            // Update account balances based on transaction type and payment mode
            if (transactionType === 'credit') {
                if (paymentMode === 'Cash') {
                    account.amountInCash += amount;
                } else if (paymentMode === 'Bank') {
                    account.amountInBank += amount;
                }
            } else if (transactionType === 'debit') {
                if (paymentMode === 'Cash') {
                    if (account.amountInCash >= amount) {
                        account.amountInCash -= amount;
                    } else {
                        throw new Error('Insufficient bank balance in the account.');
                    }
                } else if (paymentMode === 'Bank') {
                    account.amountInBank -= amount;
                }
            }

            // Save the updated account balance
            await account.save({ transaction: transactionStart });

            // Commit the transaction
            await transactionStart.commit();

            return res.status(201).json({
                message: 'Transaction created successfully',
                data: transaction,
            });

        } catch (error) {
            // Rollback the transaction in case of an error
            if (transactionStart) {
                await transactionStart.rollback();
            }
            console.log(error)
            return res.status(500).json({
                message: 'Error creating transaction',
                error: error.message,
            });
        }
    }

    async getTransactionByCustomerId(req, res) {
        try {
            const { customerId } = req.query;
            console.log({ customerId })
            const transactions = await Transaction.findAll({
                where: { customerId },
                order: [['createdAt', 'DESC']], // Order receipts by date descending
                include: [
                    {
                        model: Worker, // Assuming your model is called 'Worker'
                        attributes: ['workerId', 'name', 'role'], // Include the necessary attributes of the worker
                    },
                    {
                        model: Account,
                        attributes: ['name']
                    }
                ],
            });
            res.status(200).json(transactions);
        } catch (error) {
            console.log("error caught in receipt id", error)
            res.status(500).json({ error: error.message });
        }
    }

    async getTransactionByAccountId(req, res) {
        try {
            const { accountId } = req.query;
            console.log({ accountId })
            const transactions = await Transaction.findAll({
                where: { accountId },
                order: [['createdAt', 'DESC']], // Order receipts by date descending
                include: [
                    {
                        model: Customer, // Assuming your model is called 'Product'
                        attributes: ['customerId', 'name'], // Include the necessary attributes of the product
                    },
                    {
                        model: Worker, // Assuming your model is called 'Worker'
                        attributes: ['workerId', 'name', 'role'], // Include the necessary attributes of the worker
                    },
                ],
            });
            res.status(200).json(transactions);
        } catch (error) {
            console.log("error caught in receipt id", error)
            res.status(500).json({ error: error.message });
        }
    }
}

export default new TransactionController();
