import express from "express";
import { v4 as uuidv4 } from "uuid";
import { ERROR_MESSAGES, API_ENDPOINTS } from "../config/constants.js";
import {
  processDocument,
  extractTransactions,
  extractKeyValuePairs,
  extractSummery,
} from "../services/documentAI.js";

const router = express.Router();

router.post(API_ENDPOINTS.PROCESS_DOCUMENT, async (req, res, next) => {
  try {
    const { content } = req.body;

    // Validate the content
    if (
      !content ||
      typeof content !== "string" ||
      !/^[A-Za-z0-9+/=]+$/.test(content)
    ) {
      return res.status(400).json({
        success: false,
        error: {
          message: ERROR_MESSAGES.INVALID_CONTENT,
          code: "INVALID_CONTENT",
        },
      });
    }

    console.log("Processing document...");
    const result = await processDocument(content);

    // const extractedDocument = await extractKeyValuePairs(result.document);
    const extractedDocument = await extractSummery(result.document);
    console.log("extractedDocument: ", extractedDocument);

    const data = extractTransactions(result.document);

    console.log("Transactions extracted successfully");
    res.json({
      success: true,
      data: {
        extractedDocument: extractedDocument,
        result: result,
        transactions: data.transactions.map((t) => ({
          ...t,
          id: uuidv4(),
        })),
        confidence: data.confidence,
      },
    });
  } catch (error) {
    console.error("Error processing document:", error);
    next(error);
  }
});

export default router;
