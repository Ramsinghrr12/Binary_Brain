// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    status: { type: String, required: true },
    output: { type: String },
    executionTime: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);