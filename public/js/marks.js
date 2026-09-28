let selectedStudentId = null;
let subjectRows = [];

const defaultSubjects = ['Full Stack', 'ML', 'CPP', 'DWDM', 'MFML', 'OOSE'];

document.addEventListener('DOMContentLoaded', loadStudentList);

async function loadStudentList() {
  try {
    const students = await apiGet('/students');
    const sel = document.getElementById('marks-student');
    sel.innerHTML = '<option value="">— Choose a student —</option>';
    students.forEach(s => {
      sel.innerHTML += `<option value="${s.id}">${s.name} (${s.rollNo})</option>`;
    });
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadMarksForStudent() {
  selectedStudentId = document.getElementById('marks-student').value;
  if (!selectedStudentId) {
    document.getElementById('marks-area').style.display = 'none';
    return;
  }

  try {
    const student = await apiGet(`/students/${selectedStudentId}`);
    if (student.marks && student.marks.length > 0) {
      subjectRows = student.marks.map(m => ({
        subject: m.subject,
        marks: m.marks,
        maxMarks: m.maxMarks,
      }));
    } else {
      // pre-fill with default subjects
      subjectRows = defaultSubjects.map(s => ({ subject: s, marks: '', maxMarks: 100 }));
    }
    document.getElementById('marks-area').style.display = '';
    renderSubjects();
    updateSummary();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderSubjects() {
  const el = document.getElementById('subjects-list');
  let html = `
    <div class="table-wrapper">
      <table>
        <thead><tr><th>Subject</th><th>Marks Obtained</th><th>Max Marks</th><th></th></tr></thead>
        <tbody>`;
  subjectRows.forEach((r, i) => {
    html += `
      <tr>
        <td><input class="form-control" value="${r.subject}" onchange="updateRow(${i},'subject',this.value)" placeholder="Subject name" /></td>
        <td><input class="form-control" type="number" min="0" value="${r.marks}" onchange="updateRow(${i},'marks',this.value)" placeholder="0" /></td>
        <td><input class="form-control" type="number" min="1" value="${r.maxMarks}" onchange="updateRow(${i},'maxMarks',this.value)" placeholder="100" /></td>
        <td><button class="btn btn-danger btn-icon btn-sm" onclick="removeRow(${i})">✕</button></td>
      </tr>`;
  });
  html += '</tbody></table></div>';
  el.innerHTML = html;
}

function addSubjectRow() {
  subjectRows.push({ subject: '', marks: '', maxMarks: 100 });
  renderSubjects();
}

function removeRow(i) {
  subjectRows.splice(i, 1);
  renderSubjects();
  updateSummary();
}

function updateRow(i, field, value) {
  subjectRows[i][field] = field === 'subject' ? value : Number(value);
  updateSummary();
}

function updateSummary() {
  const valid = subjectRows.filter(r => r.marks !== '' && !isNaN(r.marks));
  if (valid.length === 0) {
    document.getElementById('grade-summary').textContent = '';
    return;
  }
  const total = valid.reduce((a, r) => a + Number(r.marks), 0);
  const max = valid.reduce((a, r) => a + Number(r.maxMarks || 100), 0);
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  let grade;
  if (pct >= 90) grade = 'A+';
  else if (pct >= 80) grade = 'A';
  else if (pct >= 70) grade = 'B+';
  else if (pct >= 60) grade = 'B';
  else if (pct >= 50) grade = 'C';
  else if (pct >= 40) grade = 'D';
  else grade = 'F';
  document.getElementById('grade-summary').textContent = `Total: ${total}/${max} | ${pct}% | Grade: ${grade}`;
}

async function saveMarks() {
  if (!selectedStudentId) return;
  const subjects = subjectRows
    .filter(r => r.subject && r.marks !== '' && !isNaN(r.marks))
    .map(r => ({ subject: r.subject, marks: Number(r.marks), maxMarks: Number(r.maxMarks) || 100 }));

  if (subjects.length === 0) {
    showToast('Enter at least one subject with marks', 'error');
    return;
  }

  try {
    await apiPost(`/students/${selectedStudentId}/marks`, { subjects });
    showToast('Marks saved successfully');
    loadMarksForStudent(); // refresh
  } catch (err) {
    showToast(err.message, 'error');
  }
}
