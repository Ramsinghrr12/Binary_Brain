// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: true },
    tags: [{ type: String }],
    testCases: [{
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
    }],
    allowedLanguages: [{ type: String }],
    solutionCode: { type: String },
    timeLimit: { type: Number, required: true },
    memoryLimit: { type: Number, required: true },
    constraints: { type: String },
    examples: [{
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
    }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);