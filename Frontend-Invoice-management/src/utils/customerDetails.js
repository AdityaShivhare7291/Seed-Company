

async function getCustomerSummary(customerId) {
    try {
        const { customerId } = req.query;

        // Calculate total credit (amount get from Customer)
        const totalCredit = await Transaction.sum('amount', {
            where: { customerId, transactionType: 'credit' }
        });

        // Calculate total debit (amount paid to the  customer)
        const totalDebit = await Transaction.sum('amount', {
            where: { customerId, transactionType: 'debit' }
        });

        // Products bought by the customer from receipts
        const productsBought = await Receipt.findAll({
            where: { customerId },
            include: [
                {
                    model: Product, // Assuming Receipt has an association with Product
                    attributes: ['cropName'],
                }
            ],
            attributes: [
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
                [sequelize.fn('COUNT', sequelize.col('receiptId')), 'totalReceipts']
            ],
            group: ['Product.cropName']
        });

        res.status(200).json({
            totalCredit: totalCredit || 0,
            totalDebit: totalDebit || 0,
            productsBought
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer summary', error: error.message });
    }
}


export default { getCustomerSummary }