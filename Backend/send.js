require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edunexus');

  // clear small sample (careful in prod)
  await User.deleteMany({});
  await Course.deleteMany({});

  const pass = 'Password123';
  const admin = new User({ name: 'Admin', email: 'admin@example.com', password: pass, role: 'admin' });
  const instructor = new User({ name: 'Instructor', email: 'instructor@example.com', password: pass, role: 'instructor' });
  const student = new User({ name: 'Student', email: 'student@example.com', password: pass, role: 'student' });

  await admin.save();
  await instructor.save();
  await student.save();

  const course = new Course({ title: 'Intro to MERN', description: 'Sample course', instructor: instructor._id });
  await course.save();

  console.log('Seeded: admin/instructor/student with password "Password123" and one sample course.');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });