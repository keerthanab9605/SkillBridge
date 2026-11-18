import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const safeUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, headline: user.headline, location: user.location, bio: user.bio, skills: user.skills, resumeUrl: user.resumeUrl, savedJobs: user.savedJobs });
const tokenFor = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
router.post('/register', async (req, res, next) => { try {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
  if (password.length < 8) return res.status(400).json({ message: 'Use a password with at least 8 characters.' });
  if (!['student', 'recruiter'].includes(role || 'student')) return res.status(400).json({ message: 'Choose Student or Recruiter.' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: role || 'student' });
  res.status(201).json({ token: tokenFor(user), user: safeUser(user) });
} catch (e) { next(e); } });
router.post('/login', async (req, res, next) => { try {
  const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  res.json({ token: tokenFor(user), user: safeUser(user) });
} catch (e) { next(e); } });
router.get('/me', protect, (req, res) => res.json({ user: safeUser(req.user) }));
export default router;
