const axios = require('axios')
const express = require('express')

const router = express.Router()

router.use((_, res, next) => {
  res.locals.version = "v1"
  next()
})

router.get('/', (req, res) => {
  res.status(200).json({ 
    version: res.locals.version
  })
})

router.get('/TriggerMessage', async (req, res) => {
  // (0)  Get chargePoint from body request
  const { chargePoint, payload } = req.body

  try {
    // (1) Fetch URI for request from Redis
    const config = await req.app.locals.redis.hGetAll(chargePoint)

    // (2) Send request to specific URI from (1)
    const ocpp_result = await axios.post("http://" + config.internal_path + config.api + 'TriggerMessage', {
      chargerId: chargePoint,
      payload: payload
    })

    // (3) Waiting response and return to callee
    res.status(200).json({ URI, ocpp_result: JSON.stringify(ocpp_result), config })
  } catch (error) {
    // (4) Return error when found
    res.status(500).json({ error: JSON.stringify(error)})
  }
})

router.get('/TriggerMessageMQ', async (req, res) => {
  const { chargerId, payload } = req.body;
  try {
    const { mqChannel } = req.app;
    const data = {
      chargerId, 
      method: "TriggerMessage", 
      payload
    };
    const isSent = mqChannel.sendToQueue('my_queue', Buffer.from(data))
    res.status(200).json({ success: true, isSent });
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router