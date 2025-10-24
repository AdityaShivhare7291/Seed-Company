import { DataTypes } from 'sequelize';
import sequelize from './dbConnection.js';

import Worker from './workers.js';


const Customer = sequelize.define(
  'Customer',
  {
    customerId: {
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
        isNumeric: true, // Ensures  only numeric characters are entered
        len: [5, 15], // Ensures phone number length is between 10 and 15 digits
      },
    },
    custType: {
      type: DataTypes.ENUM('party', 'normal'), // Enum for customer type
      allowNull: false,
      defaultValue: 'normal', // Default to 'normal' if not specified
    },

    amount: {
      type: DataTypes.FLOAT, // Amount stored as a floating-point number
      allowNull: false,
    },
    workerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workers',
        key: 'workerId',
      },
    },
  },

  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    tableName: 'customers', // Optional: specify the table name
  }
);



export default Customer;
