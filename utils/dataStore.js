const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'students.json');

/* ---------- low-level read / write ---------- */

function readStudents() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf8');
}

/* ---------- helpers ---------- */

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function calcGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}


/* ---------- CRUD ---------- */

function getAllStudents({ search, branch, year } = {}) {
  let students = readStudents();

  if (search) {
    const q = search.toLowerCase();
    students = students.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q)
    );
  }
  if (branch) {
    students = students.filter(s => s.branch === branch);
  }
  if (year) {
    students = students.filter(s => String(s.year) === String(year));
  }

  return students;
}

function getStudentById(id) {
  const students = readStudents();
  const student = students.find(s => s.id === id);
  if (!student) return null;
  return student;
}

function createStudent({ name, rollNo, branch, year, email, phone }) {
  const students = readStudents();

  // duplicate roll-number check
  if (students.some(s => s.rollNo === rollNo)) {
    return { error: 'A student with this roll number already exists.' };
  }

  const student = {
    id: generateId(),
    name,
    rollNo,
    branch,
    year: Number(year),
    email,
    phone,
    marks: [],
    createdAt: new Date().toISOString(),
  };

  students.push(student);
  writeStudents(students);
  return student;
}

function updateStudent(id, updates) {
  const students = readStudents();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return null;

  // if rollNo is changing, check for duplicates
  if (updates.rollNo && updates.rollNo !== students[idx].rollNo) {
    if (students.some(s => s.rollNo === updates.rollNo)) {
      return { error: 'A student with this roll number already exists.' };
    }
  }

  const allowed = ['name', 'rollNo', 'branch', 'year', 'email', 'phone'];
  allowed.forEach(key => {
    if (updates[key] !== undefined) {
      students[idx][key] = key === 'year' ? Number(updates[key]) : updates[key];
    }
  });

  writeStudents(students);
  return students[idx];
}

function deleteStudent(id) {
  const students = readStudents();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return false;
  students.splice(idx, 1);
  writeStudents(students);
  return true;
}


/* ---------- marks ---------- */

function saveMarks(id, { subjects }) {
  const students = readStudents();
  const student = students.find(s => s.id === id);
  if (!student) return null;

  student.marks = subjects.map(s => ({
    subject: s.subject,
    marks: Number(s.marks),
    maxMarks: Number(s.maxMarks) || 100,
  }));

  // calculate total, percentage, grade
  const totalObtained = student.marks.reduce((a, m) => a + m.marks, 0);
  const totalMax = student.marks.reduce((a, m) => a + m.maxMarks, 0);
  const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  student.totalMarks = totalObtained;
  student.maxTotalMarks = totalMax;
  student.percentage = percentage;
  student.grade = calcGrade(percentage);

  writeStudents(students);
  return student;
}

/* ---------- dashboard stats ---------- */

function getDashboardStats() {
  const students = readStudents();
  const total = students.length;

  const branches = {};
  const years = {};

  students.forEach(s => {
    branches[s.branch] = (branches[s.branch] || 0) + 1;
    years[s.year] = (years[s.year] || 0) + 1;
  });

  // recently registered (last 5)
  const recent = [...students]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(s => ({ id: s.id, name: s.name, rollNo: s.rollNo, branch: s.branch, year: s.year }));

  return {
    total,
    branchCount: Object.keys(branches).length,
    yearGroupCount: Object.keys(years).length,
    branches,
    years,
    recent,
  };
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  saveMarks,
  getDashboardStats,
};
