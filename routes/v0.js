const express = require('express')

const router = express.Router()

router.use((_, res, next) => {
  res.locals.version = "v0"
  next()
});

router.get('/', (req, res) => {
  res.status(200).json({ 
    version: res.locals.version
  })
})

module.exports = router