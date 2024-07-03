const express = require('express');
const { topup, deduct, getBalance } = require('../services/walletService');
const router = express.Router();

router.post('/topup', async (req, res) => {
    try {
        const { user_id, amount } = req.body;
        const result = await topup(user_id, amount);
        res.json({ status: true, new_balance: result.newBalance, transaction_id: result.transactionId });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

router.post('/deduct', async (req, res) => {
    try {
        const { user_id, amount } = req.body;
        const result = await deduct(user_id, amount);
        res.json({ status: true, new_balance: result.newBalance, transaction_id: result.transactionId });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

router.get('/balance', async (req, res) => {
    try {
        const { user_id } = req.query;
        const result = await getBalance(user_id);
        res.json({ balance: result.balance });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});

module.exports = router;
