require('dotenv').config();

import fs from 'node:fs';
import https from 'node:https';

import app from './app';
import { mongoConnect } from './services/mongo';

const PORT: string | number = process.env.PORT || 5000;

async function startServer() {
  await mongoConnect();

  https
    .createServer(
      {
        key: fs.readFileSync('key.pem'),    // path to private key
        cert: fs.readFileSync('cert.pem'),  // path to SSL/TSL certificate
      },
      app
    )
    .listen(PORT, () =>
      console.log(`====> express yourself on port ${PORT}<====`)
    );
}

startServer();
