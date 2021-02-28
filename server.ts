import https from 'https'
import fs from 'fs'
import Config from './config'

import { RequestListener } from 'node:http'

const createServer = (app: RequestListener) => {
  return https.createServer(
    {
      cert: fs.readFileSync(Config.cert),
      key: fs.readFileSync(Config.key),
      ca: fs.readFileSync(Config.ca),
      requestCert: true,
      rejectUnauthorized: false
    },
    app
  )
}

export { createServer }
