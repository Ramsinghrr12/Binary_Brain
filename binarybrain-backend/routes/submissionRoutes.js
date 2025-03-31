// routes/submissionRoutes.js
const express = require('express');
const { submitCode } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/submit', protect, submitCode);

module.exports = router;