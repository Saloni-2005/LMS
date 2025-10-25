const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');
const Course = require('../models/Course');
const dotenv = require('dotenv');
dotenv.config();

// list all courses with search, filter, and sort
router.get('/', auth, async (req,res) => {
  const { search, category, sort, level } = req.query;
  
  let query = {};
  
  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Category filter
  if (category && category !== 'All Categories') {
    query.category = category;
  }
  
  // Level filter
  if (level && level !== 'All Levels') {
    query.level = level;
  }
  
  // Sort functionality
  let sortOption = {};
  switch (sort) {
    case 'Newest':
      sortOption = { createdAt: -1 };
      break;
    case 'Oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'Popular':
      sortOption = { students: -1 };
      break;
    case 'Rating':
      sortOption = { averageRating: -1 };
      break;
    case 'Title':
      sortOption = { title: 1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }
  
  const courses = await Course.find(query)
    .populate('instructor','name email')
    .sort(sortOption);
    
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

// get user's enrolled courses
router.get('/user/enrolled', auth, async (req,res) => {
  const courses = await Course.find({ students: req.user._id }).populate('instructor','name email');
  res.json(courses);
});

// get course stats
router.get('/:id/stats', auth, async (req,res) => {
  const course = await Course.findById(req.params.id).populate('students');
  if(!course) return res.status(404).json({ message: 'Course not found' });
  
  const stats = {
    enrollmentCount: course.students.length,
    averageRating: course.averageRating,
    totalReviews: course.totalRatings,
    duration: course.duration,
    category: course.category,
    level: course.level,
    price: course.price,
    isNew: Date.now() - new Date(course.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 // New if created within 7 days
  };
  
  res.json(stats);
});

// get user's progress for a specific course
router.get('/:id/progress', auth, async (req,res) => {
  try {
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check if user is enrolled
    if(!course.students.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }
    
    // For now, return a mock progress. In a real system, this would be calculated
    // based on completed lectures, assignments, etc.
    const progress = Math.floor(Math.random() * 100); // Mock progress
    
    res.json({ progress });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// rate a course
router.post('/:id/rate', auth, async (req,res) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);
    
    if(!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check if user is enrolled
    if(!course.students.includes(req.user._id)) {
      return res.status(403).json({ message: 'Must be enrolled to rate this course' });
    }
    
    // Check if user already rated
    const existingRating = course.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this course' });
    }
    
    // Add rating
    course.ratings.push({
      user: req.user._id,
      rating: rating,
      review: review
    });
    
    // Calculate new average rating
    course.calculateAverageRating();
    await course.save();
    
    res.json({ message: 'Rating submitted successfully', averageRating: course.averageRating });
  } catch (error) {
    console.error('Error rating course:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

// get course ratings
router.get('/:id/ratings', auth, async (req,res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('ratings.user', 'name email')
      .select('ratings averageRating totalRatings');
    
    if(!course) return res.status(404).json({ message: 'Course not found' });
    
    res.json({
      ratings: course.ratings,
      averageRating: course.averageRating,
      totalRatings: course.totalRatings
    });
  } catch (error) {
    console.error('Error fetching course ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
});

module.exports = router;