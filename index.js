// express service
const app = require('./express')

// config
const dotenv = require('dotenv')
dotenv.config()

async function run() { 
  const PORT = process.env.SIMPLE_API_PORT || 80
  app.listen(PORT, () => console.log(`Express listenning at ${PORT}`))
}

run()