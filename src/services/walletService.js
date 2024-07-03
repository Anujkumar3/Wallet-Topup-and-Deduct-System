const pool = require('../models/db');
const { v4: uuidv4 } = require('uuid');

async function topup(userId, amount) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const res = await client.query('UPDATE users SET balance = balance + $1 WHERE user_id = $2 RETURNING balance', [amount, userId]);
        const transactionId = uuidv4();
        await client.query('INSERT INTO transactions (user_id, amount, transaction_id) VALUES ($1, $2, $3)', [userId, amount, transactionId]);
        await client.query('COMMIT');
        return { newBalance: res.rows[0].balance, transactionId };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

async function deduct(userId, amount) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const res = await client.query('UPDATE users SET balance = balance - $1 WHERE user_id = $2 RETURNING balance', [amount, userId]);
        const transactionId = uuidv4();
        await client.query('INSERT INTO transactions (user_id, amount, transaction_id) VALUES ($1, -$2, $3)', [userId, amount, transactionId]);
        await client.query('COMMIT');
        return { newBalance: res.rows[0].balance, transactionId };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

async function getBalance(userId) {
    const res = await pool.query('SELECT balance FROM users WHERE user_id = $1', [userId]);
    return { balance: res.rows[0].balance };
}

module.exports = { topup, deduct, getBalance };
