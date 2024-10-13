import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";
import pdf from "pdf-parse";
import CustomEmbeddings from "../services/embeddings";
import HomeworkIndex from "../models/homeworkModel"; // Import the HomeworkIndex model
import CustomLLM from "../services/llmservices";
import Profile from "../models/profileModel";
import { spreadSchedule, ScheduleItem, Constraint, Homework } from "../utils/algo";
import { rotateY } from "@shopify/react-native-skia";

// Extend Request interface to include 'file' property for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const llm = CustomLLM;
const router = Router();
const upload = multer({ dest: "uploads/" });

const embeddings = new CustomEmbeddings();

router.post(
  "/uploadhomework/:userId",
  upload.single("pdf"),
  async (req: MulterRequest, res: Response) => {
    const { userId } = req.params;
    const { deadline } = req.body;

    try {
      if (!req.file) {
        res.status(400).json({ error: "No PDF file uploaded" });
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
        deadline,
      });

      // Clean up the uploaded file
      await fs.unlink(req.file.path);

      const constraints: Constraint[] = await getProfileConstraintsById(userId);
      console.log(constraints);
      // const finalschedule: ScheduleItem[] = spreadSchedule();

      const llm = new CustomLLM();
      const predictPrompt = `This is the new homework: ${text}. Please tell me how much time it would take to complete this new homework.
          Answer only with one number in hours. Here is an example of a valid answer: {answer: 5}
      `;
      // const predictTime: number = JSON.parse(await llm.call(predictPrompt)).answer;
      const predictTime = 10;
      console.log(predictTime);

      const newHW = {
        name: req.file.originalname,
        estimatedCompletion: predictTime,
        deadline: deadline
      };

      const homeworks: Homework[] = await getHomeworks(userId, newHW);
      
      console.log(JSON.stringify(homeworks))

       

      // Create a prompt using the constraints
      const prompt = `Here are the constraints for the user: ${JSON.stringify(constraints)}.
      Here are the homework list for the user: ${JSON.stringify(homeworks)}
      Generate a study schedule in json format based on these constraints, and homework can be split into timezone if needed.
      The return JSON format must look like this:
      {
        {
          "name": "sciencehomework",
          "from": "2024-10-13T07:00:00",
          "to": "2024-10-13T07:30:00"
        },
        {
          "name": "sciencehomework",
          "from": "2024-10-13T08:00:00",
          "to": "2024-10-13T08:30:00"
        },
        {
          "name": "arthomeowork",
          "from": "2024-10-13T06:30:00",
          "to": "2024-10-13T07:00:00"
        }
      }
      Only return a study schedule in valid json format with no unnessary token.`;

      // Use CustomLLM to generate a response
      // const llmresponse = await llm.call(prompt);
      // console.log(llmresponse)

      const finalschedule: ScheduleItem[] = spreadSchedule(homeworks, constraints);

      res.json({finalschedule});
    } catch (error) {
      console.error("Error uploading homework:", error);
      res
        .status(500)
        .json({
          error: `An error occurred while processing the homework: ${error}`,
        });
    }
  }
);

const getProfileConstraintsById = async (userId: string) => {
  try {
    const profile = await Profile.findById(userId);
    if (profile && profile.constraints) {
      return profile.constraints;  // Return the constraints
    } else {
      throw new Error('Constraints not found');
    }
  } catch (err: any) {
    throw new Error(`Server error: ${err.message}`);
  }
};

const getHomeworks = async (userId: string, newHW: any) => {
  try {
    // Simulated homeworks in valid JSON format
    let homeworks = [
        {
          "name": "mathHomework",
          "estimatedCompletion": 5,  // 2 hours (30-minute increments)
          "deadline": "2024-10-13T00:00:00"
        },
        {
          "name": "sciencehomework",
          "estimatedCompletion": 7,  // 1.5 hours (30-minute increments)
          "deadline": "2024-10-17T00:00:00"
        },
        {
          "name": "arthomeowork",
          "estimatedCompletion": 11,  // 2 hours (30-minute increments)
          "deadline": "2024-10-16T00:00:00"
        },
        newHW
      ];

    return homeworks
  } catch (error: any) {
    throw new Error(`Error fetching homeworks: ${error.message}`);
  }
};

export default router;
