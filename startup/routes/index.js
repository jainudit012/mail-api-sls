const express = require('express')
const router = express.Router()
const mailController = require('./mails/mail.controller')
const healthController = require('./health.controller')
router.use('/mails', mailController)
router.use('/health', healthController)
// Add more routes here if you want!
module.exports = router