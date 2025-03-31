// routes/questionRoutes.js
const express = require('express');
const { addQuestion, getQuestions, getQuestionById, deleteQuestion } = require('../controllers/questionController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, admin, addQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.delete('/:id', protect, admin, deleteQuestion);

module.exports = router;