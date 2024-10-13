import dotenv from "dotenv";
import express from "express";
const cors = require("cors");
//routes
import profileRoutes from "./routes/profileRoutes";
import uploadHomeworkRoute from "./routes/uploadHomeworkRoute";
import predictRoute from "./routes/predictRoute"

const app = express();

dotenv.config();

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

app.use("/api", profileRoutes);
app.use("/api", uploadHomeworkRoute);
app.use("/api", predictRoute);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
