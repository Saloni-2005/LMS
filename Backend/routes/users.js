const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// list users (admin)
router.get('/', auth, permit('admin'), async (req,res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// get user
router.get('/:id', auth, permit('admin'), async (req,res) => {
  const user = await User.findById(req.params.id).select('-password');
  if(!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
});

// update role
router.put('/:id', auth, permit('admin'), async (req,res) => {
  const user = await User.findById(req.params.id);
  if(!user) return res.status(404).json({ message: 'Not found' });
  user.role = req.body.role || user.role;
  await user.save();
  res.json(user);
});

// delete
router.delete('/:id', auth, permit('admin'), async (req,res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// get dashboard stats for current user
router.get('/dashboard/stats', auth, async (req,res) => {
  const Course = require('../models/Course');
  const Assignment = require('../models/Assignment');
  const Submission = require('../models/Submission');
  
  try {
    // Get user's enrolled courses
    const enrolledCourses = await Course.find({ students: req.user._id });
    
    // Get assignments for enrolled courses
    const courseIds = enrolledCourses.map(course => course._id);
    const assignments = await Assignment.find({ course: { $in: courseIds } });
    
    // Get user's submissions
    const submissions = await Submission.find({ student: req.user._id });
    
    // Get upcoming assignments (due within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const upcomingAssignments = assignments.filter(assignment => 
      assignment.dueDate && 
      new Date(assignment.dueDate) <= sevenDaysFromNow &&
      new Date(assignment.dueDate) > new Date()
    );
    
    const stats = {
      activeCourses: enrolledCourses.length,
      totalAssignments: assignments.length,
      submittedAssignments: submissions.length,
      upcomingDeadlines: upcomingAssignments.length,
      certificates: 0, // This would come from a certificates system if implemented
      recentCourses: enrolledCourses.slice(0, 3).map(course => ({
        id: course._id,
        title: course.title,
        progress: Math.floor(Math.random() * 100), // This would be calculated from actual progress tracking
        instructor: course.instructor
      })),
      upcomingDeadlines: upcomingAssignments.map(assignment => ({
        id: assignment._id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        course: assignment.course
      }))
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

module.exports = router;