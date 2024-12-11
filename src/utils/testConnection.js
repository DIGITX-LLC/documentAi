import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { credentials } from '../config/credentials.js';

export async function testDocumentAIConnection() {
  try {
    console.log('Testing Document AI connection...');
    
    const client = new DocumentProcessorServiceClient({
      credentials,
      projectId: process.env.PROJECT_ID,
      apiEndpoint: `${process.env.LOCATION}-documentai.googleapis.com`,
    });

    const name = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION}/processors/${process.env.PROCESSOR_ID}`;
    
    // Attempt to fetch processor details (lightweight operation)
    await client.getProcessor({ name });
    
    console.log('✅ Successfully connected to Document AI API');
    console.log(`Location: ${process.env.LOCATION}`);
    console.log(`Processor ID: ${process.env.PROCESSOR_ID}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Document AI API:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.details) {
      console.error('Error details:', error.details);
    }
    throw error;
  }
}