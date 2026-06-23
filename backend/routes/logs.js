const express = require('express');
const { uploadLogs, fetchLogs } = require('../controllers/logsController');

const router = express.Router();

router.post('/upload', uploadLogs);
router.get('/', fetchLogs);

module.exports = router;
