import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { credentials } from "../config/credentials.js";

let client;

export function initializeDocumentAI() {
  if (
    !process.env.PROJECT_ID ||
    !process.env.LOCATION ||
    !process.env.PROCESSOR_ID
  ) {
    throw new Error(
      "Environment variables PROJECT_ID, LOCATION, and PROCESSOR_ID must be set"
    );
  }

  try {
    console.log("Initializing Document AI client...");
    client = new DocumentProcessorServiceClient({
      credentials,
      apiEndpoint: `${process.env.LOCATION}-documentai.googleapis.com`,
    });

    console.log("Document AI client initialized successfully");
    return client;
  } catch (error) {
    console.error("Failed to initialize Document AI client:", error);
    throw new Error(
      `Failed to initialize Document AI service: ${error.message}`
    );
  }
}

export async function processDocument(base64Content) {
  if (!client) {
    client = initializeDocumentAI();
  }

  const name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION}/processors/${process.env.PROCESSOR_ID}`;

  const request = {
    name,
    rawDocument: {
      content: base64Content,
      mimeType: "application/pdf",
    },
  };

  try {
    console.log("Sending request to Document AI...");
    const [result] = await client.processDocument(request);

    if (!result?.document) {
      throw new Error("Document AI returned empty or invalid response");
    }

    console.log("Document processed successfully");
    return result;
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
}

export function extractTransactions(document) {
  if (!document?.entities) {
    return { transactions: [], confidence: 0 };
  }

  try {
    const transactions = document.entities
      .filter((entity) => entity.type === "line_item")
      .map((entity) => {
        if (!entity.properties) return null;

        const getPropertyValue = (type) => {
          const property = entity.properties.find((p) => p.type === type);
          return property?.mentionText || "";
        };

        return {
          date: getPropertyValue("date"),
          description: getPropertyValue("description"),
          amount: getPropertyValue("amount"),
        };
      })
      .filter(Boolean);

    const confidence = document.textStyles?.[0]?.confidence || 0;

    return {
      transactions,
      confidence,
    };
  } catch (error) {
    console.error("Error extracting transactions:", error);
    return { transactions: [], confidence: 0 };
  }
}
export function extractKeyValuePairs(document) {
  if (!document?.entities) {
    return [];
  }

  try {
    // Extract key-value pairs from entities
    const keyValuePairs = document.entities
      .map((entity) => {
        const key = entity.type || ""; // Use type as key
        const value = entity.mentionText || ""; // Use mentionText as value

        // Handle normalized values (e.g., money or date values)
        let formattedValue = value;
        if (entity.normalizedValue) {
          if (entity.normalizedValue.text) {
            formattedValue = entity.normalizedValue.text; // Use the structured text value
          } else if (entity.normalizedValue.moneyValue) {
            formattedValue = `${entity.normalizedValue.moneyValue.amount} ${entity.normalizedValue.moneyValue.currencyCode}`; // Money format
          } else if (entity.normalizedValue.dateValue) {
            formattedValue = `${entity.normalizedValue.dateValue.year}-${entity.normalizedValue.dateValue.month}-${entity.normalizedValue.dateValue.day}`; // Date format
          }
        }

        // Return key-value pair only if both key and value exist
        return { key, value: formattedValue };
      })
      .filter((pair) => pair.key && pair.value); // Remove empty key-value pairs

    console.log("keyValuePairs: ", keyValuePairs);
    return keyValuePairs;
  } catch (error) {
    console.error("Error extracting key-value pairs:", error);
    return [];
  }
}
export function extractSummery(document) {
  if (!document?.entities) {
    return [];
  }

  try {
    // Extract only the values from the entities (no need for map)
    const values = document.entities
      .map((entity) => {
        let formattedValue = entity.mentionText || ""; // Use mentionText as the initial value

        // Handle normalized values (e.g., money or date values)
        if (entity.normalizedValue) {
          if (entity.normalizedValue.text) {
            formattedValue = entity.normalizedValue.text; // Use the structured text value
          } else if (entity.normalizedValue.moneyValue) {
            formattedValue = `${entity.normalizedValue.moneyValue.amount} ${entity.normalizedValue.moneyValue.currencyCode}`; // Money format
          } else if (entity.normalizedValue.dateValue) {
            formattedValue = `${entity.normalizedValue.dateValue.year}-${entity.normalizedValue.dateValue.month}-${entity.normalizedValue.dateValue.day}`; // Date format
          }
        }

        return formattedValue; // Only return the formatted value
      })
      .filter((value) => value); // Remove empty values

    return values[0]; // Return an array of values
  } catch (error) {
    console.error("Error extracting values:", error);
    return [];
  }
}

export function summarizeDocument(document) {
  if (!document) {
    throw new Error("Invalid document object");
  }

  try {
    const { transactions, confidence: transactionConfidence } =
      extractTransactions(document);

    const keyValuePairs = extractKeyValuePairs(document);

    const fullText = document.text || "";

    const summary = {
      transactions,
      transactionConfidence,
      keyValuePairs,
      fullTextSnippet: fullText.substring(0, 500),
    };

    console.log("Document summary:", summary);
    return summary;
  } catch (error) {
    console.error("Error summarizing document:", error);
    throw new Error(`Failed to summarize document: ${error.message}`);
  }
}
