import { DataTypes } from 'sequelize';
import sequelize from './dbConnection.js';

import Customer from './customers.js';
import Worker from './workers.js';
import Account from './accounts.js';

const Transaction = sequelize.define(
  'Transaction',
  {
    transactionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increments the value
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers', // Reference to the Customer model
        key: 'customerId',
      },
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts', // Reference to the Account model
        key: 'accountId',
      },
    },
    voucherNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    workerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workers',
        key: 'workerId',
      },
    },
    paymentMode: {
      type: DataTypes.ENUM('cash', 'bank'), // Enum for 'cash' or 'bank'
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.ENUM('receive', 'pay'), // Enum for 'receive' or 'pay'
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now()
    },
    amount: {
      type: DataTypes.FLOAT, // Amount stored as a floating-point number
      allowNull: false,
      validate: {
        min: 0, // Ensure the amount is non-negative
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    tableName: 'transactions', // Optional: specify the table name
  }
);


// Define associations
Transaction.belongsTo(Customer, {
  foreignKey: 'customerId',
});

Transaction.belongsTo(Worker, {
  foreignKey: 'workerId',
})

Transaction.belongsTo(Account, { foreignKey: 'accountId' });

export default Transaction;
