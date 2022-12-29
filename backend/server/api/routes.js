const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/create-user', controller.insertUser);

module.exports = router;