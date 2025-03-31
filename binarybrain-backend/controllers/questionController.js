// controllers/questionController.js
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const Contest = require('../models/Contest');

const addQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        if (!req.user) {
            return res.json(questions);
        }

        const userId = req.user._id;
        const submissions = await Submission.find({ user: userId, status: 'Accepted' });
        const solvedQuestionIds = new Set(submissions.map(sub => sub.question.toString()));
        const questionsWithSolvedStatus = questions.map(question => ({
            ...question._doc,
            solved: solvedQuestionIds.has(question._id.toString())
        }));

        res.json(questionsWithSolvedStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;

        // Check if the question exists
        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        // Delete associated submissions
        await Submission.deleteMany({ question: questionId });

        // Remove the question from any contests
        await Contest.updateMany(
            { questions: questionId },
            { $pull: { questions: questionId } }
        );

        // Delete the question
        await Question.findByIdAndDelete(questionId);

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addQuestion, getQuestions, getQuestionById, deleteQuestion };