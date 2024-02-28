const express = require("express")
const bodyParser = require("body-parser")
const app = express()

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

const dotenv = require("dotenv")
dotenv.config()

const PORT = process.env.SIMPLE_API_PORT || 80;
app.listen(PORT, () => console.log(`Simple API are listenning on port ${PORT}`))