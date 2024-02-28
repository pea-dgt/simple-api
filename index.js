// express service
const app = require('./express')

// config
const dotenv = require('dotenv')
dotenv.config()

async function run() {
  app.listen(80, () => console.log(`Express listenning at 80`)) 
}

run()