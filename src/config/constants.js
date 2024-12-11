export const REQUIRED_ENV_VARS = [
  'PROJECT_ID',
  'LOCATION',
  'PROCESSOR_ID',
  'CLIENT_EMAIL',
  'PRIVATE_KEY'
];

export const API_ENDPOINTS = {
  PROCESS_DOCUMENT: '/process-document'
};

export const ERROR_MESSAGES = {
  NO_CONTENT: 'No document content provided',
  PROCESSING_FAILED: 'Failed to process document',
  INVALID_MIME_TYPE: 'Invalid document type. Only PDF files are supported',
  MISSING_ENV_VARS: (vars) => `Missing required environment variables: ${vars.join(', ')}`
};