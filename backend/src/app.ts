import express from 'express';
import dotenv from 'dotenv'

//routes
import profileRoutes from './routes/profileRoutes';

const app = express();

dotenv.config();

// Middleware to parse JSON requests
app.use(express.json());

app.use('/api', profileRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;
