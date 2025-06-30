const express = require('express')
const pool = require('../db')
const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT name, email, role, date_of_birth, address FROM users'
        )
        res.json(result.rows)
    } catch (err) {
        console.error('Error fetching users:', err)
        res.status(500).json({ message: 'Server error fetching users' })
    }
})
module.exports = router