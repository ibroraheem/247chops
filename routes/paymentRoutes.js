const express = require('express');
const router = express.Router()
const { pay, verify } = require('../controller/paystack')

router.post('/pay/:email', pay)
router.get('/verify/:reference', verify)

module.exports = router