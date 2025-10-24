import { DataTypes } from 'sequelize';
import sequelize from './dbConnection.js';
import Customer from './customers.js';


const Worker = sequelize.define(
  'Worker',
  {
    workerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increments the value
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Name cannot be null
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Password cannot be null
      validate: {
        len: [8, 128], // Ensures password is at least 8 characters long and no more than 128 characters
      },
    },
    address: {
      type: DataTypes.STRING, // Allows long text for address
      allowNull: true, // Optional field
    },
    phoneNo: {
      type: DataTypes.STRING, // Phone number as a string to handle various formats
      allowNull: false,
      validate: {
        isNumeric: true, // Ensures only numbers are entered
        len: [10, 15], // Ensures the phone number length is between 10 and 15 digits
      },
    },
    profileUrl: {
      type: DataTypes.STRING, // Stores the URL as a string
      allowNull: true, // Optional field
      validate: {
        isUrl: true, // Ensures the value is a valid URL
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'worker', // Defaults to "worker" if not provided
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    tableName: 'workers', // Optional: specify the table name
  }
);


export default Worker;
