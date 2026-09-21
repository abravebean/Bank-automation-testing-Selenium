require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TESTS_DIR = path.join(__dirname, 'tests');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function loadTests() {
  return fs
    .readdirSync(TESTS_DIR)
    .filter((f) => f.endsWith('.test.js'))
    .map((f) => {
      const mod = require(path.join(TESTS_DIR, f));
      return { file: f, ...mod };
    });
}

// GET /api/tests -> list of available tests (name + description)
app.get('/api/tests', (req, res) => {
  const tests = loadTests().map(({ name, description }) => ({ name, description }));
  res.json(tests);
});

// POST /api/tests/:name/run -> run a single test by name
app.post('/api/tests/:name/run', async (req, res) => {
  const tests = loadTests();
  const test = tests.find((t) => t.name === req.params.name);
  if (!test) {
    return res.status(404).json({ name: req.params.name, passed: false, message: 'Test not found' });
  }

  const start = Date.now();
  try {
    const message = await test.run();
    res.json({ name: test.name, passed: true, message: message || 'Passed', durationMs: Date.now() - start });
  } catch (err) {
    res.json({ name: test.name, passed: false, message: err.message, durationMs: Date.now() - start });
  }
});

// POST /api/tests/run-all -> run every test sequentially, return all results
app.post('/api/tests/run-all', async (req, res) => {
  const tests = loadTests();
  const results = [];

  for (const test of tests) {
    const start = Date.now();
    try {
      const message = await test.run();
      results.push({ name: test.name, passed: true, message: message || 'Passed', durationMs: Date.now() - start });
    } catch (err) {
      results.push({ name: test.name, passed: false, message: err.message, durationMs: Date.now() - start });
    }
  }

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Test dashboard running at http://localhost:${PORT}`);
});
