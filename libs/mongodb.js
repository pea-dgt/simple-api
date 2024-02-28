const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGO_URI

module.exports = {
  createMongoDBConnection: () => {
    return new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    })
  }
}
