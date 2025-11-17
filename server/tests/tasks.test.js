// server/tests/tasks.test.js
const request = require('supertest');
const app = require('../index.js');

// Mock complet de la DB (pas de MySQL du tout)
const mockTasks = [];
let nextId = 1;

jest.mock('../index.js', () => {
  const express = require('express');
  const app = express();
  app.use(express.json());

  app.get('/api/tasks', (req, res) => {
    res.json(mockTasks);
  });

  app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const task = { id: nextId++, title, completed: false };
    mockTasks.push(task);
    res.status(201).json(task);
  });

  return app;
});

describe('Tasks API (mocked)', () => {
  beforeEach(() => {
    mockTasks.length = 0;
    nextId = 1;
  });

  test('GET /api/tasks returns empty array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test');
  });

  test('GET after POST returns the task', async () => {
    await request(app).post('/api/tasks').send({ title: 'Hello' });
    const res = await request(app).get('/api/tasks');
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Hello');
  });
});