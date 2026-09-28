const express = require('express');
const router = express.Router();
const store = require('../utils/dataStore');

/* ---- dashboard ---- */
router.get('/dashboard/stats', (req, res) => {
  res.json(store.getDashboardStats());
});

/* ---- list / search / filter ---- */
router.get('/students', (req, res) => {
  const { search, branch, year } = req.query;
  res.json(store.getAllStudents({ search, branch, year }));
});

/* ---- single student ---- */
router.get('/students/:id', (req, res) => {
  const student = store.getStudentById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

/* ---- create ---- */
router.post('/students', (req, res) => {
  const { name, rollNo, branch, year, email, phone } = req.body;
  if (!name || !rollNo || !branch || !year) {
    return res.status(400).json({ error: 'Name, roll number, branch, and year are required.' });
  }
  const result = store.createStudent({ name, rollNo, branch, year, email, phone });
  if (result.error) return res.status(409).json(result);
  res.status(201).json(result);
});

/* ---- update ---- */
router.put('/students/:id', (req, res) => {
  const result = store.updateStudent(req.params.id, req.body);
  if (!result) return res.status(404).json({ error: 'Student not found' });
  if (result.error) return res.status(409).json(result);
  res.json(result);
});

/* ---- delete ---- */
router.delete('/students/:id', (req, res) => {
  const ok = store.deleteStudent(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Student not found' });
  res.json({ message: 'Student deleted' });
});


/* ---- marks ---- */
router.post('/students/:id/marks', (req, res) => {
  const { subjects } = req.body;
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ error: 'Subjects array is required.' });
  }
  const result = store.saveMarks(req.params.id, { subjects });
  if (!result) return res.status(404).json({ error: 'Student not found' });
  res.json(result);
});

module.exports = router;
