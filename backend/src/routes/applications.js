import { Router } from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { protect, allow } from '../middleware/auth.js';
const router = Router();
router.get('/mine', protect, allow('student'), async (req, res, next) => { try { const applications = await Application.find({ student: req.user._id }).populate('job').sort({ createdAt: -1 }); res.json({ applications }); } catch (e) { next(e); } });
router.get('/recruiter', protect, allow('recruiter', 'admin'), async (req, res, next) => { try { const ownJobs = req.user.role === 'admin' ? await Job.find().distinct('_id') : await Job.find({ recruiter: req.user._id }).distinct('_id'); const applications = await Application.find({ job: { $in: ownJobs } }).populate('job').populate('student', 'name email headline resumeUrl').sort({ createdAt: -1 }); res.json({ applications }); } catch (e) { next(e); } });
router.patch('/:id/status', protect, allow('recruiter', 'admin'), async (req, res, next) => { try { const app = await Application.findById(req.params.id).populate('job'); if (!app) return res.status(404).json({ message: 'Application not found.' }); if (req.user.role !== 'admin' && !app.job.recruiter.equals(req.user._id)) return res.status(403).json({ message: 'You can only update applications to your own jobs.' }); const allowed = ['Applied', 'In review', 'Interview', 'Offer', 'Rejected']; if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid application status.' }); app.status = req.body.status; await app.save(); res.json({ application: app }); } catch (e) { next(e); } });
export default router;
