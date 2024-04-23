// express service
const app = require('./express')

// config
const dotenv = require('dotenv')
dotenv.config()

app.listen(process.env.OCPP_SERVER_PORT, () => console.log(`Express started`))