import https from 'https'
import fs from 'fs'

import { RequestListener } from 'node:http'

const createServer = (app: RequestListener) => {
  return https.createServer(
    {
      cert: fs.readFileSync('certs/server-crt.pem'),
      key: fs.readFileSync('certs/server-key.pem'),
      ca: fs.readFileSync('certs/ca-cert.pem'),
      requestCert: true,
      rejectUnauthorized: false
    },
    app
  )
}

export { createServer }
