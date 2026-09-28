document.addEventListener('DOMContentLoaded', applyFilters);

async function applyFilters() {
  const search = document.getElementById('r-search').value.trim();
  const branch = document.getElementById('r-branch').value;
  const year = document.getElementById('r-year').value;

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (branch) params.set('branch', branch);
  if (year) params.set('year', year);

  try {
    const students = await apiGet('/students?' + params.toString());
    renderResults(students);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderResults(students) {
  const el = document.getElementById('results');
  if (students.length === 0) {
    el.innerHTML = '<div class="empty-state"><p>No students match your search.</p></div>';
    return;
  }

  let html = `
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>Name</th><th>Roll No</th><th>Branch</th><th>Year</th>
          <th>Grade</th><th></th>
        </tr></thead>
        <tbody>`;
  students.forEach(s => {
    const grade = s.grade || '—';
    const badgeCls = gradeBadgeClass(s.grade);
    html += `
      <tr>
        <td>${s.name}</td>
        <td><strong>${s.rollNo}</strong></td>
        <td><span class="badge badge--primary">${s.branch}</span></td>
        <td>${s.year}</td>
        <td><span class="badge ${badgeCls}">${grade}</span></td>
        <td><button class="btn btn-ghost btn-sm" onclick="viewReport('${s.id}')">View Report</button></td>
      </tr>`;
  });
  html += '</tbody></table></div>';
  el.innerHTML = html;
}

async function viewReport(id) {
  try {
    const s = await apiGet(`/students/${id}`);
    let html = '<div class="report-card">';

    // personal details
    html += `
      <div class="report-section">
        <h3>Personal Details</h3>
        <dl class="report-detail">
          <dt>Name</dt><dd>${s.name}</dd>
          <dt>Roll No</dt><dd>${s.rollNo}</dd>
          <dt>Branch</dt><dd>${s.branch}</dd>
          <dt>Year</dt><dd>${s.year}</dd>
          <dt>Email</dt><dd>${s.email || '—'}</dd>
          <dt>Phone</dt><dd>${s.phone || '—'}</dd>
          <dt>Registered</dt><dd>${fmtDate(s.createdAt)}</dd>
        </dl>
      </div>`;



    // marks
    if (s.marks && s.marks.length > 0) {
      html += `<div class="report-section"><h3>Marks &amp; Grades</h3>`;
      html += `<div class="table-wrapper"><table><thead><tr><th>Subject</th><th>Marks</th><th>Max</th></tr></thead><tbody>`;
      s.marks.forEach(m => {
        html += `<tr><td>${m.subject}</td><td>${m.marks}</td><td>${m.maxMarks}</td></tr>`;
      });
      html += '</tbody></table></div>';
      html += `
        <div class="mt-1" style="display:flex;gap:1.5rem;font-weight:600">
          <span>Total: ${s.totalMarks || 0}/${s.maxTotalMarks || 0}</span>
          <span>Percentage: ${s.percentage ?? 0}%</span>
          <span>Grade: <span class="badge ${gradeBadgeClass(s.grade)}">${s.grade || '—'}</span></span>
        </div>`;
      html += '</div>';
    } else {
      html += '<div class="report-section"><h3>Marks &amp; Grades</h3><p style="color:var(--clr-text-muted)">No marks recorded yet.</p></div>';
    }

    html += '</div>';
    document.getElementById('report-content').innerHTML = html;
    openModal('report-modal');
  } catch (err) {
    showToast(err.message, 'error');
  }
}
