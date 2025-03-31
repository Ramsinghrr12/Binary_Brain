// controllers/submissionController.js
const axios = require('axios');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const Contest = require('../models/Contest');

const submitCode = async (req, res) => {
    try {
        const { problemId, language, code } = req.body;
        const userId = req.user._id;

        const question = await Question.findById(problemId);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        const languageMap = {
            'python': 71,
            'java': 62,
            'cpp': 54,
            'c': 50
        };
        const languageId = languageMap[language.toLowerCase()];
        if (!languageId) return res.status(400).json({ message: 'Unsupported language' });

        let isCorrect = true;
        let output = '';
        let executionTime = 0;
        let failedTestCase = null;

        for (const testCase of question.testCases) {
            try {
                const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
                    source_code: code,
                    language_id: languageId,
                    stdin: testCase.input,
                    expected_output: testCase.expectedOutput
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    }
                });

                const token = response.data.token;

                let result;
                do {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const statusResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                        headers: {
                            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
                            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                        }
                    });
                    result = statusResponse.data;
                } while (result.status.id <= 2);

                if (result.status.id === 3) {
                    executionTime = Math.max(executionTime, result.time * 1000);
                    // Normalize output: trim whitespace, remove extra newlines, and normalize line endings
                    const actualOutput = (result.stdout || '')
                        .trim() // Remove leading/trailing whitespace and newlines
                        .replace(/\r\n/g, '\n') // Normalize Windows line endings to Unix
                        .replace(/\n+/g, '\n'); // Replace multiple newlines with a single newline
                    const expectedOutput = (testCase.expectedOutput || '')
                        .trim()
                        .replace(/\r\n/g, '\n')
                        .replace(/\n+/g, '\n');

                    if (actualOutput !== expectedOutput) {
                        isCorrect = false;
                        output = `Failed on test case: Input: ${testCase.input}, Expected: ${expectedOutput}, Got: ${actualOutput}`;
                        failedTestCase = {
                            input: testCase.input,
                            expectedOutput: expectedOutput,
                            actualOutput: actualOutput
                        };
                        break;
                    }
                } else {
                    isCorrect = false;
                    output = result.stderr || result.compile_output || `Error: ${result.status.description}`;
                    break;
                }
            } catch (error) {
                isCorrect = false;
                output = `Execution error: ${error.response?.data?.message || error.message}`;
                break;
            }
        }

        if (isCorrect) {
            output = 'All test cases passed!';
        }

        const submission = await Submission.create({
            user: userId,
            question: problemId,
            language,
            code,
            status: isCorrect ? 'Accepted' : 'Wrong Answer',
            output,
            executionTime,
        });

        if (isCorrect) {
            const user = await User.findById(userId);
            user.score = (user.score || 0) + 100;
            await user.save();

            let leaderboardEntry = await Leaderboard.findOne({ user: userId });
            if (!leaderboardEntry) {
                leaderboardEntry = await Leaderboard.create({ user: userId });
            }
            leaderboardEntry.score = user.score;
            await leaderboardEntry.save();

            const contests = await Contest.find({ questions: problemId });
            for (const contest of contests) {
                if (new Date() >= contest.startTime && new Date() <= contest.endTime) {
                    let entry = contest.leaderboard.find(e => e.user.toString() === userId.toString());
                    if (!entry) {
                        entry = { user: userId, score: 0, timeElapsed: 0 };
                        contest.leaderboard.push(entry);
                    }
                    entry.score += 100;
                    entry.timeElapsed = (new Date() - contest.startTime) / 1000;
                    await contest.save();
                }
            }
        }

        res.json({
            status: isCorrect ? 'Accepted' : 'Wrong Answer',
            output,
            submission,
            failedTestCase
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitCode };