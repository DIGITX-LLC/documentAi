import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: join(__dirname, "../../.env") });

// Ensure private key is properly formatted with actual newlines
const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!process.env.CLIENT_EMAIL || !privateKey) {
  throw new Error("Missing required credentials in environment variables");
}

export const credentials = {
  // type: "service_account",
  // project_id: process.env.PROJECT_ID,
  // private_key_id: "3e8df944dacbabe2f8ba751ce98737683b2ed5b7",
  // private_key: privateKey,
  // client_email: process.env.CLIENT_EMAIL,
  // client_id: "106730398351852703194",
  // auth_uri: "https://accounts.google.com/o/oauth2/auth",
  // token_uri: "https://oauth2.googleapis.com/token",
  // auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  // client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
  //   process.env.CLIENT_EMAIL
  // )}`,
  // universe_domain: "googleapis.com",

  type: "service_account",
  project_id: "document-ai-444403",
  private_key_id: "b152dec6e1d98002b3139202a516f0d1d933980a",
  private_key: privateKey,
  client_email: process.env.CLIENT_EMAIL,
  client_id: "113026574176730697939",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
    process.env.CLIENT_EMAIL
  )}`,
  universe_domain: "googleapis.com",
};
