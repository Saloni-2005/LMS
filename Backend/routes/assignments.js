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

// get user's assignments
router.get('/user/assignments', auth, async (req,res) => {
  try {
    const Course = require('../models/Course');
    
    // Get user's enrolled courses
    const enrolledCourses = await Course.find({ students: req.user._id });
    const courseIds = enrolledCourses.map(course => course._id);
    
    // Get assignments for enrolled courses
    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course', 'title')
      .sort({ dueDate: 1 });
    
    // Get user's submissions for these assignments
    const assignmentIds = assignments.map(a => a._id);
    const submissions = await Submission.find({ 
      assignment: { $in: assignmentIds }, 
      student: req.user._id 
    });
    
    // Create a map of submissions for quick lookup
    const submissionMap = {};
    submissions.forEach(sub => {
      submissionMap[sub.assignment.toString()] = sub;
    });
    
    // Add submission status to assignments
    const assignmentsWithStatus = assignments.map(assignment => ({
      ...assignment.toObject(),
      isSubmitted: !!submissionMap[assignment._id.toString()],
      submission: submissionMap[assignment._id.toString()] || null
    }));
    
    res.json(assignmentsWithStatus);
  } catch (error) {
    console.error('Error fetching user assignments:', error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

module.exports = router;