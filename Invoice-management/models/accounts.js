// account.js
import { DataTypes } from 'sequelize';
import sequelize from './dbConnection.js'; // Adjust the path according to your project structure

const Account = sequelize.define(
  'Account',
  {
    accountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increments the value
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Name cannot be null
    },
    address: {
      type: DataTypes.STRING, // Allows long text for address
      allowNull: true, // Optional field
    },
    phoneNo: {
      type: DataTypes.STRING, // Phone number stored as a string
      allowNull: false,
      validate: {
        isNumeric: true, // Ensures only numeric characters are entered
        len: [10, 15], // Ensures phone number length is between 10 and 15 digits
      },
    },
    amountInCash: {
      type: DataTypes.FLOAT, // Amount stored as a floating-point number
      allowNull: false,
      validate: {
        min: 0, // Ensure the amount is non-negative
      },
    },
    amountInBank: {
      type: DataTypes.FLOAT, // Amount stored as a floating-point number
      allowNull: false
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    tableName: 'accounts', // Optional: specify the table name
  }
);


// Export the Account model
export default Account;
