const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');
const Course = require('../models/Course');
const dotenv = require('dotenv');
dotenv.config();

// list all courses (any authenticated)
router.get('/', auth, async (req,res) => {
  const courses = await Course.find().populate('instructor','name email');
  res.json(courses);
});

// get single
router.get('/:id', auth, async (req,res) => {
  const course = await Course.findById(req.params.id).populate('instructor','name email');
  if(!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

// create course (instructor)
router.post('/', auth, permit('instructor'), async (req,res) => {
  const { title, description } = req.body;
  const course = new Course({ title, description, instructor: req.user._id });
  await course.save();
  res.json(course);
});

// edit (instructor or admin)
router.put('/:id', auth, permit('instructor','admin'), async (req,res) => {
  const course = await Course.findById(req.params.id);
  if(!course) return res.status(404).json({ message: 'Not found' });
  if(req.user.role !== 'admin' && !course.instructor.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(course, req.body);
  await course.save();
  res.json(course);
});

// delete
router.delete('/:id', auth, permit('instructor','admin'), async (req,res) => {
  const course = await Course.findById(req.params.id);
  if(!course) return res.status(404).json({ message: 'Not found' });
  if(req.user.role !== 'admin' && !course.instructor.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  await course.remove();
  res.json({ message: 'Deleted' });
});

// enroll
router.post('/:id/enroll', auth, permit('student'), async (req,res) => {
  const course = await Course.findById(req.params.id);
  if(!course) return res.status(404).json({ message: 'Course not found' });
  if(course.students.includes(req.user._id)) return res.status(400).json({ message: 'Already enrolled' });
  course.students.push(req.user._id);
  await course.save();
  res.json({ message: 'Enrolled' });
});

module.exports = router;