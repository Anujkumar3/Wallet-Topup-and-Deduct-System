const request = require('supertest');
const express = require('express');
const routes = require('../src/routes/routes');
const pool = require('../src/models/db');

const app = express();
app.use(express.json());
app.use('/api', routes);

beforeAll(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id VARCHAR PRIMARY KEY,
            balance FLOAT NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS transactions (
            transaction_id SERIAL PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            amount FLOAT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        );
    `);
});

afterAll(async () => {
    await pool.query(`
        DROP TABLE IF EXISTS transactions;
        DROP TABLE IF EXISTS users;
    `);
    await pool.end();
});

describe('Wallet System', () => {
    test('Topup should increase balance', async () => {
        await request(app)
            .post('/api/topup')
            .send({ user_id: 'user1', amount: 100 })
            .expect(200)
            .then(response => {
                expect(response.body.status).toBe(true);
                expect(response.body.new_balance).toBe(100);
            });
    });

    test('Deduct should decrease balance', async () => {
        await request(app)
            .post('/api/deduct')
            .send({ user_id: 'user1', amount: 50 })
            .expect(200)
            .then(response => {
                expect(response.body.status).toBe(true);
                expect(response.body.new_balance).toBe(50);
            });
    });

    test('GetBalance should return the correct balance', async () => {
        await request(app)
            .get('/api/balance')
            .query({ user_id: 'user1' })
            .expect(200)
            .then(response => {
                expect(response.body.balance).toBe(50);
            });
    });
});
