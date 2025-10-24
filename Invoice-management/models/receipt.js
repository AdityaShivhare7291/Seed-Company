import { DataTypes, ForeignKeyConstraintError } from 'sequelize';
import sequelize from './dbConnection.js';
import Customer from './customers.js';
import Product from './products.js';
import Worker from './workers.js';

const Receipt = sequelize.define(
  'Receipt',
  {
    receiptId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increments the value
    },
    lotNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers', // Reference to the Customer model
        key: 'customerId',
      },
    },
    workerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workers', // Reference to the Worker model
        key: 'workerId',
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
    products: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: true,
        isValidArray(value) {
          if (!Array.isArray(value)) {
            throw new Error("Products must be an array");
          }
          if (value.length === 0) {
            throw new Error("At least one product is required");
          }
          value.forEach((item) => {
            if (!item._id) {
              throw new Error("Each product must have an _id");
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
              throw new Error("Each product must have a valid quantity");
            }
            if (typeof item.rate !== "number" || item.rate < 0) {
              throw new Error("Each product must have a valid price");
            }
          });
        },
      },
    },
    amount: {
      type: DataTypes.FLOAT, // Amount stored as a floating-point number
      allowNull: false,
      validate: {
        min: 0, // Ensure the amount is non-negative
      },
    },
    saleType: {
      type: DataTypes.ENUM('purchase', 'buy'), // Enum for sale type
      allowNull: false,
    },
    rate: {
      type: DataTypes.FLOAT, // Numeric value for the rate
      allowNull: false,
      validate: {
        min: 0, // Ensure the rate is non-negative
      },
    },
    discount: {
      type: DataTypes.FLOAT, // Numeric value for the discount
      allowNull: false,
      validate: {
        min: 0, // Ensure the discount is non-negative
      },
    },
    finalAmount: {
      type: DataTypes.FLOAT, // Final amount to be paid
      allowNull: false,
      validate: {
        min: 0, // Ensure the final amount is non-negative
      },
    },
    weightType: {
      type: DataTypes.ENUM('Ton', 'Weight/Packing'), // Enum for weight type
      allowNull: false,
    },
    deduction: {
      type: DataTypes.FLOAT, // Deduction value as a fraction
      allowNull: false,
    },
    noOfBags: {
      type: DataTypes.INTEGER, // Number of bags
      allowNull: false,
      validate: {
        min: 0, // Ensure noOfBags is non-negative
      },
    },
    parchiNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    truckNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE, // Date of the receipt
      allowNull: false,
      defaultValue: DataTypes.NOW, // Defaults to the current date
    },
    netWeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('paid', 'unpaid'), // Enum for receipt status
      allowNull: false,
      defaultValue: 'unpaid', // Default to 'unpaid' if not specified
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    tableName: 'receipts', // Specify the table name
  }
);

Receipt.belongsTo(Customer, {
  foreignKey: 'customerId'
});

Receipt.belongsTo(Worker, {
  foreignKey: 'workerId'
})

export default Receipt;
