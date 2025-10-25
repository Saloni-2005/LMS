const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filePath: String,
  submittedAt: { type: Date, default: Date.now },
  grade: Number,
  feedback: String
});

module.exports = mongoose.model('Submission', submissionSchema);