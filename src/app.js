import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import documentAIRouter from "./routes/documentAI.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { validateEnvironment } from "./utils/validateEnv.js";
import { initializeDocumentAI } from "./services/documentAI.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

validateEnvironment();

initializeDocumentAI();

const app = express();
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy");
  next();
});
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://document.digitxgroup.com",
      "https://document.digitxgroup.com/api",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.get("/", (req, res) => {
  res.send("Server is running well");
});
app.use("/api", documentAIRouter);

app.use(errorHandler);

export { app };
