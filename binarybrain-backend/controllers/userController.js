// controllers/userController.js
const User = require('../models/User');
const Submission = require('../models/Submission');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    try {
        const normalizedEmail = email.toLowerCase().trim();
        console.log("📌 Registering with email:", normalizedEmail);

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            isAdmin: isAdmin || false,
        });

        console.log("✅ User registered:", user);

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                username: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("❌ Registration Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.toLowerCase().trim();
        console.log("📌 Attempting login with email:", normalizedEmail);

        const user = await User.findOne({ email: normalizedEmail });
        console.log("📌 User found:", user ? user : "No user found");

        if (user && (await user.matchPassword(password))) {
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    username: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("❌ Login Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                username: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserStats = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const submissions = await Submission.find({ user: userId }).populate('question');
        const totalSubmissions = submissions.length;
        const acceptedSubmissions = submissions.filter(sub => sub.status === 'Accepted').length;
        const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

        const submissionDates = user.submissionHistory.map(entry => {
            const date = new Date(entry.date);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        }).sort((a, b) => a - b);

        let streak = 0;
        let longestStreak = 0;
        let currentStreak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneDay = 24 * 60 * 60 * 1000;

        for (let i = 1; i < submissionDates.length; i++) {
            if (submissionDates[i] - submissionDates[i - 1] === oneDay) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }
            longestStreak = Math.max(longestStreak, currentStreak);
        }

        if (submissionDates.length > 0) {
            let lastDate = new Date(submissionDates[submissionDates.length - 1]);
            let currentDate = new Date(today);
            let daysDiff = Math.round((currentDate - lastDate) / oneDay);
            if (daysDiff <= 1) {
                streak = currentStreak;
            }
        }

        const stats = {
            totalSolved: acceptedSubmissions,
            easySolved: submissions.filter(sub => sub.status === 'Accepted' && sub.question.difficulty === 'Easy').length,
            mediumSolved: submissions.filter(sub => sub.status === 'Accepted' && sub.question.difficulty === 'Medium').length,
            hardSolved: submissions.filter(sub => sub.status === 'Accepted' && sub.question.difficulty === 'Hard').length,
            totalSubmissions,
            acceptanceRate,
            rank: user.rank || 1,
            score: user.score || 0,
            streak,
            longestStreak,
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addAdminUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            isAdmin: true,
        });

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                username: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, getUserStats, addAdminUser };