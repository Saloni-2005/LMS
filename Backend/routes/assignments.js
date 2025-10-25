const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const dotenv = require('dotenv');
dotenv.config();

const storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null,'uploads/'),
  filename: (req,file,cb) => cb(null, Date.now()+'-'+file.originalname)
});
const upload = multer({ storage });

// create assignment (instructor)
router.post('/:courseId', auth, permit('instructor'), async (req,res) => {
  const course = await Course.findById(req.params.courseId);
  if(!course) return res.status(404).json({ message: 'Course not found' });
  if(!course.instructor.equals(req.user._id) && req.user.role!=='admin') return res.status(403).json({ message: 'Forbidden' });

  const a = new Assignment({
    course: course._id,
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate
  });
  await a.save();
  res.json(a);
});

// student submit file
router.post('/submit/:assignmentId', auth, permit('student'), upload.single('file'), async (req,res) => {
  const assignment = await Assignment.findById(req.params.assignmentId);
  if(!assignment) return res.status(404).json({ message: 'Assignment not found' });
  const submission = new Submission({
    assignment: assignment._id,
    student: req.user._id,
    filePath: req.file ? req.file.path.replace(/\\/g, "/") : null
  });
  await submission.save();
  res.json(submission);
});

// view submissions (instructor/admin)
router.get('/:assignmentId/submissions', auth, permit('instructor','admin'), async (req,res) => {
  const subs = await Submission.find({ assignment: req.params.assignmentId }).populate('student','name email');
  res.json(subs);
});

module.exports = router;