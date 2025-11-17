// server/tests/tasks.test.js
const request = require('supertest');
const app = require('../index.js');
const mysql = require('mysql2/promise');

let connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: 'root',
    password: process.env.DB_PASSWORD'
  });
  await connection.query('CREATE DATABASE IF NOT EXISTS todo_db');
  await connection.query('USE todo_db');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    )
  `);
  await connection.query('TRUNCATE TABLE tasks');
});

afterAll(async () => {
  await connection.end();
});

describe('Tasks API', () => {
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
    expect(res.body.id).toBeDefined();
  });

  test('GET /api/tasks returns created task', async () => {
    await request(app).post('/api/tasks').send({ title: 'Apprendre Vitest' });
    const res = await request(app).get('/api/tasks');
    expect(res.body.length).toBeGreaterThan(0);
  });
});