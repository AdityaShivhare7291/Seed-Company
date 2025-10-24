import Account from '../models/accounts.js'; // Import the Account model

class AccountController {
    /**
     * Create a new account
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async createAccount(req, res) {
        const { name, address, phoneNo, amountInCash, amountInBank } = req.body;

        // Validate required fields
        if (!name || !phoneNo || amountInCash === undefined || amountInBank === undefined) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        try {
            // Create a new account
            const account = await Account.create({
                name,
                address,
                phoneNo,
                amountInCash,
                amountInBank,
            });

            return res.status(201).json({
                message: 'Account created successfully!',
                data: account,
            });
        } catch (error) {
            console.error('Error creating account:', error);
            return res.status(500).json({
                message: 'Failed to create account.',
                error: error.message,
            });
        }
    }

    /**
     * Get all accounts
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAccounts(req, res) {
        try {
            const accounts = await Account.findAll();
            return res.status(200).json({
                message: 'Accounts retrieved successfully!',
                data: accounts,
            });
        } catch (error) {
            console.error('Error retrieving accounts:', error);
            return res.status(500).json({
                message: 'Failed to retrieve accounts.',
                error: error.message,
            });
        }
    }

    /**
     * Get a single account by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAccountById(req, res) {
        const { id } = req.params;

        try {
            const account = await Account.findByPk(id);

            if (!account) {
                return res.status(404).json({ message: 'Account not found.' });
            }

            return res.status(200).json({
                message: 'Account retrieved successfully!',
                data: account,
            });
        } catch (error) {
            console.error('Error retrieving account:', error);
            return res.status(500).json({
                message: 'Failed to retrieve account.',
                error: error.message,
            });
        }
    }

    /**
     * Update an account
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateAccount(req, res) {
        const { id } = req.params;
        const { name, address, phoneNo, amountInCash, amountInBank } = req.body;

        try {
            const account = await Account.findByPk(id);

            if (!account) {
                return res.status(404).json({ message: 'Account not found.' });
            }

            // Update the account with new data
            await account.update({ name, address, phoneNo, amountInCash, amountInBank });

            return res.status(200).json({
                message: 'Account updated successfully!',
                data: account,
            });
        } catch (error) {
            console.error('Error updating account:', error);
            return res.status(500).json({
                message: 'Failed to update account.',
                error: error.message,
            });
        }
    }

    /**
     *Get all Transaction from specific account
     */
    async getAccountTransaction(req, res) {

    }

    /**
     * Delete an account
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteAccount(req, res) {
        const { id } = req.params;

        try {
            const account = await Account.findByPk(id);

            if (!account) {
                return res.status(404).json({ message: 'Account not found.' });
            }

            // Delete the account
            await account.destroy();

            return res.status(200).json({ message: 'Account deleted successfully!' });
        } catch (error) {
            console.error('Error deleting account:', error);
            return res.status(500).json({
                message: 'Failed to delete account.',
                error: error.message,
            });
        }
    }
}

// Export an instance of the AccountController class
export default new AccountController();
