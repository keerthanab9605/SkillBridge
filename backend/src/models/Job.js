import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, company: { type: String, required: true, trim: true },
  location: { type: String, default: 'India' }, type: { type: String, enum: ['Full-time', 'Internship', 'Part-time', 'Contract'], default: 'Full-time' },
  mode: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'Hybrid' },
  category: { type: String, default: 'Technology' }, salary: { type: String, default: 'Not disclosed' },
  description: { type: String, required: true }, requirements: [{ type: String }], skills: [{ type: String }],
  experience: { type: String, default: 'Fresher' }, deadline: { type: Date }, featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'closed'], default: 'active' }, recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });
export default mongoose.model('Job', jobSchema);
