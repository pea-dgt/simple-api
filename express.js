// Dotenv initial
const dotenv = require("dotenv")
dotenv.config()

// Express initial
const express = require("express")
const bodyParser = require("body-parser")
const app = express()

// Redis initial
const { createClient } = require('redis')

// Mongo global config
const { createMongoDBConnection } = require('./libs/mongodb')

// Express global config
app.use(bodyParser.json())
bodyParser.urlencoded({ extended: true })

if (!app.locals.mongo) {
  console.log(`Initialize MongoDB`);
  app.locals.mongo = createMongoDBConnection()
}

// async function initialRedisConnection () {
//   if (!app.locals.redis) {
//     console.log(`Initialize Redis client`, process.env.REDIS_URI)
//     app.locals.redis = await createClient({
//       url: process.env.REDIS_URI
//     })
//     .on('error', err => console.log('Redis Client Error', err))
//     .connect()
//   }
// }

// initialRedisConnection()

// Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Access ${req.path}`)
  next()
})

// Route group
app.use('/api/v0', require('./routes/v0'))
app.use('/api/v1', require('./routes/v1'))

// Route at root
app.get('/', (req, res) => res.status(200).json({ path: req.path }))

app.get('/health', (_, res) => {
  res.status(200).json({
    health: true
  })
})

app.get('/mongo', async (req, res) => {

  try {
    // Connect the client to the server	(optional starting in v4.7)
    const { mongo: client }  = req.app.locals
    console.log('Connecting to Mongo server...');
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("volta-poc").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    res.status(200).json({})
  } catch (error) {
    console.error(error)
    await client.close();
    res.status(500).json({})
    // Ensures that the client will close when you finish/error
  }
})

module.exports = app