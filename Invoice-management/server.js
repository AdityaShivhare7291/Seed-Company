import express from 'express';
import cors from 'cors';
import { main } from './models/index.js';
import Product from './models/products.js';
import Customer from './models/customers.js';
import Worker from './models/workers.js';
import Transaction from './models/transaction.js';
import Receipt from './models/receipt.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/product.js'
import custRoute from './routes/customer.js';
import workerRoute from './routes/worker.js';
import accountRoutes from "./routes/account.js"
import receiptRoutes from "./routes/receipt.js"
import transactionRoutes from "./routes/transaction.js"
import sendMail from './emailsending.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = () => {
  main();

  app.use(express.json());
  const upload = multer({ dest: 'uploads/' });
  app.use(cors(
    {
      origin: '*',  // Allow only requests from React app
      methods: 'GET,POST',             // Specify allowed HTTP methods
    }
  ));

  app.use('/api/worker', workerRoute);
  app.use('/api/customer', custRoute);
  app.use('/api/products', productRoutes);
  app.use('/api/accounts', accountRoutes);
  app.use('/api/receipt', receiptRoutes);
  app.use('/api/transaction', transactionRoutes);

  app.get('/sendMail', (req, res) => {
    sendMail()
    res.status(200).json({ message: 'hello developers' });
  })

  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const filePath = req.file.path; // Path to the uploaded file
      const fileName = req.file.originalname; // Original file name
      sendMail(filePath, fileName)
      res.status(200).send({ message: 'File uploaded and email sent successfully!' });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).send({ message: 'Failed to upload and send email.' });
    }
  });

  // Serve static files from the React app in production
  if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../Frontend-Invoice-management/build');
    app.use(express.static(buildPath));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.send('Backend server is running. Frontend is served separately in development.');
    });
  }

  app.listen(PORT, () => {
    console.log('I am live again');
    console.log(`Server running on port ${PORT}`);
  });

}

startServer();
export default startServer;
