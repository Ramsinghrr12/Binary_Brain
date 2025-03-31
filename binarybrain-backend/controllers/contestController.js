// controllers/contestController.js
const Contest = require('../models/Contest');
const Question = require('../models/Question');

const createContest = async (req, res) => {
    try {
        const { title, startTime, endTime, questions } = req.body;

        if (questions && questions.length > 0) {
            const existingQuestions = await Question.find({ _id: { $in: questions } });
            if (existingQuestions.length !== questions.length) {
                return res.status(400).json({ message: 'One or more question IDs are invalid' });
            }
        }

        const contest = await Contest.create({
            title,
            startTime,
            endTime,
            questions: questions || [],
            leaderboard: [],
        });

        res.status(201).json(contest);
    } catch (error) {
        console.error('Error creating contest:', error);
        res.status(500).json({ message: error.message });
    }
};

const getContests = async (req, res) => {
    try {
        const contests = await Contest.find().populate('questions', 'title');
        res.json(contests);
    } catch (error) {
        console.error('Error fetching contests:', error);
        res.status(500).json({ message: error.message });
    }
};

const getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id).populate('questions', 'title');
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        res.json(contest);
    } catch (error) {
        console.error('Error fetching contest by ID:', error);
        res.status(500).json({ message: `Failed to fetch contest details: ${error.message}` });
    }
};

const deleteContest = async (req, res) => {
    try {
        const contestId = req.params.id;
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }
        await Contest.findByIdAndDelete(contestId);
        res.json({ message: 'Contest deleted successfully' });
    } catch (error) {
        console.error('Error deleting contest:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createContest, getContests, getContestById, deleteContest };