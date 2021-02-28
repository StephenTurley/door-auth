import express, { NextFunction } from 'express'
import { checkCert } from './middleware/auth'
import { createServer } from './server'

const app = express()
app.use(checkCert())

app.get('/', (req, res) => res.json('hello'))
const server = createServer(app)

export default server
