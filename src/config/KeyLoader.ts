import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { API_ENV_KEY, API_SECRET_ENV_KEY } from './constants';

// Load environment variables from .env file
dotenv.config();

export const loadKeyfile = (keyFilePath?: string) => {
  let keyData = { name: '', privateKey: '' };

  if (keyFilePath) {
    const absoluteKeyFilePath = path.resolve(__dirname, '../../', keyFilePath);
    const keyFileContent = fs.readFileSync(absoluteKeyFilePath, 'utf8');
    keyData = JSON.parse(keyFileContent);
  } else {
    keyData.name = process.env[API_ENV_KEY] || '';
    keyData.privateKey = process.env[API_SECRET_ENV_KEY] || '';
  }

  return {
    name: keyData.name,
    privateKey: keyData.privateKey
  };
};
