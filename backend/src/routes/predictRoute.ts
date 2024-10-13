import { Router, Request, Response } from 'express';
import CustomLLM from '../services/llmservices';  // Import the CustomLLM class

const router = Router();
const llm = new CustomLLM();

// Define the /chat endpoint to use CustomLLM to generate a response
router.post('/predict', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt in request body' });
      return;
    }

    // Use the CustomLLM to generate a response
    const response = await llm.call(prompt);

    res.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

export default router;