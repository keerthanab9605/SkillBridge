import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  coverLetter: { type: String, default: '' },
  status: { type: String, enum: ['Applied', 'In review', 'Interview', 'Offer', 'Rejected'], default: 'Applied' }
}, { timestamps: true });
schema.index({ student: 1, job: 1 }, { unique: true });
export default mongoose.model('Application', schema);
