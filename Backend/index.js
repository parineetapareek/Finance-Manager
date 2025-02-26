import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import routes from './routes/index.js'

dotenv.config();

const app = express();
const port = 3000;
 
// Middleware 
app.use(express.json());
app.use(cors());

// Database Connection 
connectDB();

// Routes 
app.use('/',routes);

// Start Server 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
