const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /conversations?page=1
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  const query = `
    SELECT c.id AS contact_id, c.name, c.phone_number, m.content, m.timestamp
    FROM contacts c
    JOIN LATERAL (
      SELECT content, timestamp
      FROM messages
      WHERE contact_id = c.id
      ORDER BY timestamp DESC
      LIMIT 1
    ) m ON true
    ORDER BY m.timestamp DESC
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

// GET /search?value=John&page=1
router.get('/search', async (req, res) => {
  const searchValue = req.query.value || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  const query = `
    SELECT c.id AS contact_id, c.name, c.phone_number, m.content, m.timestamp
    FROM contacts c
    JOIN messages m ON c.id = m.contact_id
    WHERE c.name ILIKE $1
       OR c.phone_number ILIKE $1
       OR m.content ILIKE $1
    ORDER BY m.timestamp DESC
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
