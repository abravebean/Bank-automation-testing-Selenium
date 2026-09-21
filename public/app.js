const testList = document.getElementById('test-list');
const runAllBtn = document.getElementById('run-all');

let tests = [];

function statusText({ passed, message, durationMs }) {
  const icon = passed ? '✓ PASS' : '✗ FAIL';
  const time = durationMs != null ? ` (${(durationMs / 1000).toFixed(1)}s)` : '';
  return `${icon}${time} — ${message}`;
}

function renderTests() {
  if (!tests.length) {
    testList.innerHTML = '<p class="loading">No tests found in /tests.</p>';
    return;
  }

  testList.innerHTML = tests
    .map(
      (t) => `
    <div class="test-row" data-name="${t.name}">
      <div class="test-name">${t.name}</div>
      <button class="test-run-btn">Run</button>
      <div class="test-desc">${t.description || ''}</div>
      <div class="status"></div>
    </div>
  `
    )
    .join('');

  testList.querySelectorAll('.test-row').forEach((row) => {
    const btn = row.querySelector('.test-run-btn');
    btn.addEventListener('click', () => runOne(row.dataset.name));
  });
}

function setRowPending(name) {
  const row = testList.querySelector(`.test-row[data-name="${name}"]`);
  const status = row.querySelector('.status');
  status.className = 'status visible pending';
  status.textContent = 'Running…';
  row.querySelector('.test-run-btn').disabled = true;
}

function setRowResult(result) {
  const row = testList.querySelector(`.test-row[data-name="${result.name}"]`);
  if (!row) return;
  const status = row.querySelector('.status');
  status.className = `status visible ${result.passed ? 'pass' : 'fail'}`;
  status.textContent = statusText(result);
  row.querySelector('.test-run-btn').disabled = false;
}

async function runOne(name) {
  setRowPending(name);
  const res = await fetch(`/api/tests/${encodeURIComponent(name)}/run`, { method: 'POST' });
  const result = await res.json();
  setRowResult(result);
}

async function runAll() {
  runAllBtn.disabled = true;
  tests.forEach((t) => setRowPending(t.name));
  try {
    const res = await fetch('/api/tests/run-all', { method: 'POST' });
    const results = await res.json();
    results.forEach(setRowResult);
  } finally {
    runAllBtn.disabled = false;
  }
}

async function init() {
  const res = await fetch('/api/tests');
  tests = await res.json();
  renderTests();
}

runAllBtn.addEventListener('click', runAll);
init();
