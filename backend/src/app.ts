import express from 'express';
import dotenv from 'dotenv'

//routes
import profileRoutes from './routes/profileRoutes';
import uploadHomeworkRoute from './routes/uploadHomeworkRoute'

const app = express();

dotenv.config();

// Middleware to parse JSON requests
app.use(express.json());

app.use('/api', profileRoutes);
app.use('/api', uploadHomeworkRoute);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;
