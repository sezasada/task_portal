const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', rejectUnauthenticated, async (req, res) => {
    const userId = req.user.id;

    try {
        const queryText = `
        SELECT * FROM "tasks"
        WHERE "assigned_to_id" = $1
      `;
        const result = await pool.query(queryText, [userId]);
        res.send(result.rows);
    } catch (error) {
        console.log('error getting task', error);
        res.sendStatus(500);
    }
});

router.post('/', rejectUnauthenticated, async (req, res) => {
  try {
    const {
      title, notes, has_budget,
      budget, location_id, status,
      time_created, is_time_sensitive, due_date
    } = req.body;
    const created_by_id = req.user.id;
    const assigned_to_id = req.user.id;
    const queryText = `
      INSERT INTO "tasks" (
        "title",
        "notes",
        "has_budget",
        "budget",
        "location_id",
        "status",
        "created_by_id",
        "assigned_to_id",
        "time_created",
        "is_time_sensitive",
        "due_date",
        "is_approved"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING "id"
    `;
    const result = await pool.query(queryText, [
      title, notes, has_budget,
      budget, location_id, status,
      created_by_id, assigned_to_id, time_created,
      is_time_sensitive, due_date, false
    ]);
    res.send(result.rows[0]);
  } catch (error) {
    console.log('Error creating task', error);
    res.sendStatus(500);
  }
});

module.exports = router

