import { DataTypes } from 'sequelize';
import sequelize from './dbConnection.js'; // Your sequelize instance setup


const Product = sequelize.define(
  'Product',
  {
    cropId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increments the value
    },
    cropName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Variety: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: true, // Enables createdAt and updatedAt
    tableName: 'products', // Name of the table in the SQLite database
  }
);


export default Product;
