import sqlite3 from 'sqlite3';
sqlite3.verbose();
import sequelize from './dbConnection.js';
import Worker from './workers.js';
import Customer from './customers.js';

async function main() {
  const db = new sqlite3.Database('C:/Database/local_inventory.db', (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });
  await sequelize.sync({ force: false }); // Set to `true` to recreate tables
  console.log('Database synchronized!');
}

// Define Associations
Worker.hasMany(Customer, { foreignKey: 'workerId' });
Customer.belongsTo(Worker, { foreignKey: 'workerId' });

export { main, Worker, Customer };
