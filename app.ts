import express, { NextFunction } from 'express'
import { tlsAuthentication } from './middleware/auth'
import { createServer } from './server'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())
app.use(tlsAuthentication())

app.post('/event', (req, res) => res.json('hello'))
const server = createServer(app)

export default server
