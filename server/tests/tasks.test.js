// server/tests/tasks.test.js
const request = require('supertest');
const express = require('express');

// On crée un mock complet d'Express directement dans le test
let tasks = [];
let nextId = 1;

const createMockApp = () => {
  const app = express();
  app.use(express.json());

  // Reset avant chaque test
  tasks = [];
  nextId = 1;

  app.get('/api/tasks', (req, res) => {
    res.json(tasks);
  });

  app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }
    const task = { id: nextId++, title, completed: false };
    tasks.push(task);
    res.status(201).json(task);
  });

  return app;
};

describe('Tasks API (in-memory mock)', () => {
  let app;

  beforeEach(() => {
    app = createMockApp();
  });

  test('GET /api/tasks returns empty array initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Faire les courses' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Faire les courses');
    expect(res.body.id).toBe(1);
  });

  test('GET after POST returns the task', async () => {
    await request(app).post('/api/tasks').send({ title: 'Apprendre Vitest' });
    const res = await request(app).get('/api/tasks');
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Apprendre Vitest');
  });
});