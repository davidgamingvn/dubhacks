import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import pdf from 'pdf-parse';
import CustomEmbeddings from '../services/embeddings';
import HomeworkIndex from '../models/homeworkModel'; // Import the HomeworkIndex model

// Extend Request interface to include 'file' property for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = Router();
const upload = multer({ dest: 'uploads/' });

const embeddings = new CustomEmbeddings();

router.post('/uploadhomework/:userId', upload.single('pdf'), async (req: MulterRequest, res: Response) => {
  const { userId } = req.params;
  const { deadline } = req.body;
  
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No PDF file uploaded' });
      return;
    }

    // Extract text from the uploaded PDF
    const pdfBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdf(pdfBuffer);
    const text = pdfData.text;


    // Generate embeddings for the text
    const embedding = await embeddings.embedQuery(text);

    // Store the text and embedding in MongoDB
    await HomeworkIndex.create({
      title: req.file.originalname,
      text,
      embedding,
      userId,
      deadline
    });

    // Clean up the uploaded file
    await fs.unlink(req.file.path);

    res.json({ message: 'Homework uploaded and processed successfully' });
  } catch (error) {
    console.error('Error uploading homework:', error);
    res.status(500).json({ error: `An error occurred while processing the homework: ${error}` });
  }
});

export default router;
