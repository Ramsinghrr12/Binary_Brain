// routes/contestRoutes.js
const express = require('express');
const { createContest, getContests, getContestById, deleteContest } = require('../controllers/contestController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, admin, createContest);
router.get('/', getContests);
router.get('/:id', getContestById);
router.delete('/:id', protect, admin, deleteContest);

module.exports = router;