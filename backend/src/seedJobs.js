import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Job from './models/Job.js';
if (!process.env.MONGO_URI) { console.error('Set MONGO_URI in backend/.env first.'); process.exit(1); }
const samples = [
 {title:'Frontend Developer Intern',company:'Pixelwave Studio',location:'Bengaluru, India',type:'Internship',mode:'Hybrid',category:'Design & Engineering',salary:'₹18k–25k / month',description:'Build delightful, accessible product experiences with a close-knit design and engineering team. You will ship real features, learn code review practices, and work with React and TypeScript.',skills:['React','TypeScript','CSS'],experience:'Fresher',featured:true},
 {title:'Graduate Software Engineer',company:'Northstar Labs',location:'Remote, India',type:'Full-time',mode:'Remote',category:'Engineering',salary:'₹6–9 LPA',description:'Join a collaborative team solving interesting problems across the product stack. Great for curious graduates who love learning and building.',skills:['JavaScript','Node.js','SQL'],experience:'Fresher'},
 {title:'Product Design Intern',company:'Mosaic',location:'Bengaluru, India',type:'Internship',mode:'On-site',category:'Design',salary:'₹15k–20k / month',description:'Help turn complex workflows into simple, thoughtful product experiences. Partner with product managers and engineers from discovery through delivery.',skills:['Figma','Prototyping','Research'],experience:'Fresher'},
 {title:'Data Analyst — Early Career',company:'Orbit Analytics',location:'Hyderabad, India',type:'Full-time',mode:'Hybrid',category:'Data & Analytics',salary:'₹5–7 LPA',description:'Use data to answer meaningful business questions. Create dashboards, validate datasets, and present insights to stakeholders in a supportive team.',skills:['SQL','Python','Power BI'],experience:'0–1 years'},
 {title:'Backend Engineering Intern',company:'Cloudnest',location:'Remote, India',type:'Internship',mode:'Remote',category:'Engineering',salary:'₹20k / month',description:'Design and implement APIs, write reliable tests, and learn how production services are deployed and monitored.',skills:['Node.js','MongoDB','REST APIs'],experience:'Fresher',featured:true},
 {title:'Talent Acquisition Trainee',company:'PeopleFirst',location:'Bengaluru, India',type:'Full-time',mode:'Hybrid',category:'People & Culture',salary:'₹3.5–5 LPA',description:'Help create a candidate-first hiring experience, coordinate interviews, and learn sourcing and recruiting operations with a welcoming team.',skills:['Communication','Sourcing','Organisation'],experience:'Fresher'},
 {title:'QA Automation Intern',company:'Brightbyte',location:'Pune, India',type:'Internship',mode:'Hybrid',category:'Engineering',salary:'₹16k–22k / month',description:'Work with developers to improve quality, write automated tests, and make the release process more confident and repeatable.',skills:['Testing','JavaScript','Playwright'],experience:'Fresher'},
 {title:'Junior UX Researcher',company:'Goodform',location:'Remote, India',type:'Full-time',mode:'Remote',category:'Design',salary:'₹4–6 LPA',description:'Plan user interviews, synthesise feedback, and help teams understand the people they are designing for.',skills:['Research','Figma','Communication'],experience:'0–1 years'}
];
try {
 await mongoose.connect(process.env.MONGO_URI);
 let recruiter = await User.findOne({ email: 'sample.recruiter@skillbridge.local' });
 if (!recruiter) recruiter = await User.create({ name: 'SkillBridge Sample Recruiter', email: 'sample.recruiter@skillbridge.local', password: await bcrypt.hash(`${Date.now()}-not-for-login`, 12), role: 'recruiter', headline: 'SkillBridge sample listings' });
 let inserted = 0;
 for (const sample of samples) { const exists = await Job.findOne({ title: sample.title, company: sample.company }); if (!exists) { await Job.create({ ...sample, recruiter: recruiter._id }); inserted++; } }
 console.log(`Sample listings ready. Added ${inserted} new jobs.`);
} catch (e) { console.error('Could not seed jobs:', e.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
