const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /conversations?page=1
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  const query = `
    SELECT *
    FROM recent_conversations
    ORDER BY timestamp DESC
    LIMIT $1 OFFSET $2;
  `;

  try {
    const result = await pool.query(query, [limit, offset]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching conversations');
  }
});

// GET /conversations/search?value=...&page=1
router.get('/search', async (req, res) => {
  const searchValue = req.query.value || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  const query = `
    SELECT *
    FROM recent_conversations
    WHERE name ILIKE $1
       OR phone_number ILIKE $1
       OR content ILIKE $1
    ORDER BY timestamp DESC
    LIMIT $2 OFFSET $3;
  `;

  try {
    const result = await pool.query(query, [`%${searchValue}%`, limit, offset]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error performing search');
  }
});

module.exports = router;