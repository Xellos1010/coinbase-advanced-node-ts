import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { BASE_URL, WS_BASE_URL } from './constants';

// Load environment variables from .env file
dotenv.config();

export const loadRestConfig = (keyFilePath?: string) => { //Change to loadRestConfig
  let keyData = { name: '', privateKey: '' };

  if (keyFilePath) {
    const absoluteKeyFilePath = path.resolve(__dirname, '../../', keyFilePath);
    const keyFileContent = fs.readFileSync(absoluteKeyFilePath, 'utf8');
    keyData = JSON.parse(keyFileContent);
  }

  const baseUrl = BASE_URL as string;

  return {
    name: keyData.name,
    privateKey: keyData.privateKey,
    baseUrl: baseUrl,
  };
};

export const loadWsConfig = (keyFilePath?: string) => {
  let keyData = { name: '', privateKey: '' };

  if (keyFilePath) {
    const absoluteKeyFilePath = path.resolve(__dirname, '../../', keyFilePath);
    const keyFileContent = fs.readFileSync(absoluteKeyFilePath, 'utf8');
    keyData = JSON.parse(keyFileContent);
  }

  const baseUrl = WS_BASE_URL as string;

  return {
    name: keyData.name,
    privateKey: keyData.privateKey,
    baseUrl: baseUrl,
  };
};