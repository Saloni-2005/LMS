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

module.exports = router;