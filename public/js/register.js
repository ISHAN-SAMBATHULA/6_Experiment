let allStudents = [];

document.addEventListener('DOMContentLoaded', loadStudents);

async function loadStudents() {
  try {
    allStudents = await apiGet('/students');
    renderTable();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderTable() {
  const el = document.getElementById('student-list');
  if (allStudents.length === 0) {
    el.innerHTML = '<div class="empty-state"><p>No students registered yet. Click <strong>+ Add Student</strong> to get started.</p></div>';
    return;
  }
  let html = `
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>Name</th><th>Roll No</th><th>Branch</th><th>Year</th><th>Email</th><th>Phone</th><th style="text-align:right">Actions</th>
        </tr></thead>
        <tbody>`;
  allStudents.forEach(s => {
    html += `
      <tr>
        <td>${s.name}</td>
        <td><strong>${s.rollNo}</strong></td>
        <td><span class="badge badge--primary">${s.branch}</span></td>
        <td>${s.year}</td>
        <td>${s.email || '—'}</td>
        <td>${s.phone || '—'}</td>
        <td class="text-right">
          <button class="btn btn-ghost btn-sm" onclick="openEditModal('${s.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="handleDelete('${s.id}')">Delete</button>
        </td>
      </tr>`;
  });
  html += '</tbody></table></div>';
  el.innerHTML = html;
}

function openAddModal() {
  document.getElementById('modal-title').textContent = 'Add Student';
  document.getElementById('submit-btn').textContent = 'Add Student';
  document.getElementById('student-form').reset();
  document.getElementById('edit-id').value = '';
  openModal('student-modal');
}

function openEditModal(id) {
  const s = allStudents.find(x => x.id === id);
  if (!s) return;
  document.getElementById('modal-title').textContent = 'Edit Student';
  document.getElementById('submit-btn').textContent = 'Save Changes';
  document.getElementById('edit-id').value = s.id;
  document.getElementById('f-name').value = s.name;
  document.getElementById('f-roll').value = s.rollNo;
  document.getElementById('f-branch').value = s.branch;
  document.getElementById('f-year').value = s.year;
  document.getElementById('f-email').value = s.email || '';
  document.getElementById('f-phone').value = s.phone || '';
  openModal('student-modal');
}

async function handleStudentSubmit(e) {
  e.preventDefault();
  const body = {
    name: document.getElementById('f-name').value.trim(),
    rollNo: document.getElementById('f-roll').value.trim(),
    branch: document.getElementById('f-branch').value,
    year: document.getElementById('f-year').value,
    email: document.getElementById('f-email').value.trim(),
    phone: document.getElementById('f-phone').value.trim(),
  };
  const editId = document.getElementById('edit-id').value;
  try {
    if (editId) {
      await apiPut(`/students/${editId}`, body);
      showToast('Student updated successfully');
    } else {
      await apiPost('/students', body);
      showToast('Student added successfully');
    }
    closeModal('student-modal');
    loadStudents();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleDelete(id) {
  if (!confirm('Delete this student? This cannot be undone.')) return;
  try {
    await apiDelete(`/students/${id}`);
    showToast('Student deleted');
    loadStudents();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
