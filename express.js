const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const bodyParser = require("body-parser")
const app = express()

// Mongo global config
const { createMongoDBConnection } = require('./libs/mongodb');
app.set('mongo_db', createMongoDBConnection())

app.use(bodyParser.json())
bodyParser.urlencoded({ extended: true })

app.use((req, _, next) => {
  console.log(`Access ${req.path}`)
  next()
})

app.get('/', (_, res) => {
  res.status(200).json({})
})

app.get('/health', (_, res) => {
  res.status(200).json({
    health: true
  })
})

module.exports = app