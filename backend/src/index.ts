const express = require("express");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
import { Collection } from "mongodb";
import { Request, Response } from "express";
import pdf from "pdf-parse";
import fs from "fs/promises";
const axios = require("axios");
const multer = require("multer");
import { VectorStore } from "langchain/vectorstores";
// const { VectorStore } = require("langchain/vectorstores/base");

dotenv.config();

const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

const EMBEDDING_ENDPOINT =
  process.env.EMBEDDING_ENDPOINT || "http://10.18.93.169:11434/api/embeddings";
const GENERATE_ENDPOINT =
  process.env.GENERATE_ENDPOINT || "http://10.18.93.169:11434/api/generate";

const RAG_PROMPT_INTEL_RAW = `### System: You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise. 
  ### User: Question: {question}
  Context: {context}
  ### Assistant: `;

async function connectToMongoDB() {
  await client.connect();
  console.log("Connected to MongoDB Atlas");
}

interface Document {
  title: string;
  text: string;
  embedding: number[];
  deadline: string;
  metadata: Record<string, any>;
}

interface EmbeddingResponse {
  embedding: number[];
}

interface GenerateResponse {
  response: string;
}

class CustomVectorStore extends VectorStore {
  collection: Collection;

  constructor(collection: Collection) {
    super();
    this.collection = collection;
  }

  async addDocuments(documents: Document[]): Promise<void> {
    await this.collection.insertMany(documents);
  }

  async similaritySearch(query: number[], k: number): Promise<Document[]> {
    const results = await this.collection
      .aggregate([
        {
          $search: {
            knnBeta: {
              vector: query,
              path: "embedding",
              k: k,
            },
          },
        },
      ])
      .toArray();

    return results as Document[];
  }
}

const extractTextFromPDF = async (
  pdfFile: Express.Multer.File
): Promise<string> => {
  const pdfBuffer = await fs.readFile(pdfFile.path);
  const pdfData = await pdf(pdfBuffer);
  return pdfData.text;
};

const getEmbedding = async (text: string): Promise<number[]> => {
  const response = await axios.post(EMBEDDING_ENDPOINT, {
    model: "mxbai-embed-large",
    prompt: text,
  });
  return response.data.embedding;
};

const upsertEmbeddingWithCustomStore = async (
  title: string,
  text: string,
  embedding: number[],
  deadline: string
) => {
  await client.connect();
  const database = client.db(DATABASE_NAME);
  const collection = database.collection(COLLECTION_NAME);

  const vectorStore = new CustomVectorStore(collection);

  const document: Document = {
    title,
    text,
    embedding,
    deadline,
    metadata: {},
  };

  await vectorStore.addDocuments([document]);
  await client.close();
};

// code translate from python code of RAG
async function getSources(question: string): Promise<Document[]> {
  const embedding = await getEmbedding(
    `Represent this sentence for searching relevant passages: ${question}`
  );

  const db = client.db(DATABASE_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const sources = await collection
    .aggregate([
      {
        $search: {
          knnBeta: {
            vector: embedding,
            path: "embedding",
            k: 2,
          },
        },
      },
      {
        $project: {
          text: 1,
          score: { $meta: "searchScore" },
        },
      },
    ])
    .toArray();

  return sources as Document[];
}

async function getAnswer(
  question: string,
  sources: Document[]
): Promise<string> {
  const context = sources.map((s) => s.text).join("\n");
  const prompt = RAG_PROMPT_INTEL_RAW.replace("{question}", question).replace(
    "{context}",
    context
  );

  const response = await axios.post(GENERATE_ENDPOINT, {
    model: "llama3",
    prompt: prompt,
    stream: false,
  });

  return response.data.response;
}

app.post(
  "/upload_file",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { title, deadline } = req.body;

      if (!file || !title || !deadline) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const pdfText = await extractTextFromPDF(file);
      const embedding = await getEmbedding(pdfText);
      await upsertEmbeddingWithCustomStore(title, pdfText, embedding, deadline);

      // Clean up the uploaded file
      await fs.unlink(file.path);

      res
        .status(200)
        .json({ message: "PDF uploaded and embedding stored successfully." });
    } catch (error) {
      console.error("Error processing PDF:", error);
      res
        .status(500)
        .json({ error: "Error uploading file or storing embedding." });
    }
  }
);

app.post("/query", async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    const queryEmbedding = await getEmbedding(query);

    await client.connect();
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);
    const vectorStore = new CustomVectorStore(collection);

    const results = await vectorStore.similaritySearch(queryEmbedding, 5);

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error performing similarity search." });
  } finally {
    await client.close();
  }
});

// endpoint for predicting how many hours it takes to complete a task
app.post("/predict", async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ error: "Missing question in request body" });
    }

    const sources = await getSources(question);
    const answer = await getAnswer(question, sources);

    res.json({ answer });
  } catch (error) {
    console.error("Error in RAG answer:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
  res.send("Express + TypeScript Server");
});

// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });

(async () => {
  try {
    await connectToMongoDB();
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
})();
