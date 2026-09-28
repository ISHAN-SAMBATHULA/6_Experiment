document.addEventListener('DOMContentLoaded', async () => {
  try {
    const stats = await apiGet('/dashboard/stats');

    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-branches').textContent = stats.branchCount;
    document.getElementById('stat-years').textContent = stats.yearGroupCount;
    document.getElementById('stat-registered').textContent = stats.total;

    // breakdown
    const breakdownEl = document.getElementById('breakdown');
    if (Object.keys(stats.branches).length === 0 && Object.keys(stats.years).length === 0) {
      breakdownEl.innerHTML = '<div class="empty-state"><p>No students registered yet.</p></div>';
    } else {
      let html = '<table><thead><tr><th>Category</th><th>Name</th><th>Count</th></tr></thead><tbody>';
      for (const [b, c] of Object.entries(stats.branches)) {
        html += `<tr><td><span class="badge badge--primary">Branch</span></td><td>${b}</td><td>${c}</td></tr>`;
      }
      for (const [y, c] of Object.entries(stats.years)) {
        html += `<tr><td><span class="badge badge--info">Year</span></td><td>Year ${y}</td><td>${c}</td></tr>`;
      }
      html += '</tbody></table>';
      breakdownEl.innerHTML = `<div class="table-wrapper">${html}</div>`;
    }

    // recent
    const recentEl = document.getElementById('recent');
    if (stats.recent.length === 0) {
      recentEl.innerHTML = '<div class="empty-state"><p>No students yet. Go register some!</p></div>';
    } else {
      let html = '<table><thead><tr><th>Name</th><th>Roll No</th><th>Branch</th></tr></thead><tbody>';
      stats.recent.forEach(s => {
        html += `<tr><td>${s.name}</td><td>${s.rollNo}</td><td><span class="badge badge--accent">${s.branch}</span></td></tr>`;
      });
      html += '</tbody></table>';
      recentEl.innerHTML = `<div class="table-wrapper">${html}</div>`;
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
});
