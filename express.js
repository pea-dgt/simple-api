// Dotenv initial
const dotenv = require("dotenv");
dotenv.config();

// Express initial
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Redis initial
const { createClient } = require('redis');

// Mongo global config
const { createMongoDBConnection } = require('./libs/mongodb');

// Express global config
app.use(bodyParser.json());
bodyParser.urlencoded({ extended: true });

if (!app.locals.mongo) {
  console.log(`Initialize MongoDB`);
  app.locals.mongo = createMongoDBConnection();
}

async function initialRedisConnection () {
  if (!app.locals.redis) {
    console.log(`Initializing Redis client`, process.env.REDIS_URI);
    try {
      const r = createClient({
        url: process.env.REDIS_URI,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
      });
      r.on('error', err => console.log('Redis Client Error', err));
      await r.connect();
      app.locals.redis = r;
    } catch (error) {
      console.log(`Redis error cause`, error);      
    }
  }
}

initialRedisConnection()

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
  const { mongo: client }  = req.app.locals;

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("volta-db").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  } finally {
    await client.close();
  }
});

app.get('/chargers', async (req, res) => {
  const { mongo: client }  = req.app.locals;

  try {
    await client.connect();

    const { chargerId } = req.query;
    const db = client.db("volta-db");
    const chargersCollection = db.collection("chargers");
    const chargers =  await chargersCollection.find({ chargerId }).toArray();
    
    res.status(200).json({ chargers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  } finally {
    await client.close();
  }
});

app.get('/redis', async (req, res) => {
  const { redis } = req.app.locals;
  const { key } = req.query;
  try {
    const v = await redis.get(key);
    res.status(200).json({
      redis,
      [key]: v
    });
  } catch (error) {
    res.status(500).json({
      error
    });     
  }
});

module.exports = app