import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
if (!process.env.MONGO_URI || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first.'); process.exit(1);
}
if (process.env.ADMIN_PASSWORD.length < 12) { console.error('For safety, ADMIN_PASSWORD must be at least 12 characters.'); process.exit(1); }
try {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await User.findOneAndUpdate({ email }, { name: 'SkillBridge Admin', email, password, role: 'admin' }, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`Admin account ready for ${email}. Password is not printed.`);
} catch (e) { console.error('Could not seed admin:', e.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
