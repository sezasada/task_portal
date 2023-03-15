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


/*BASIC USER PUT ROUTES*/
//user assigns task to themselves
router.put(`/user_assign`, (req, res) => {
  let user_id = req.user.id;
  let time_assigned = req.body.time_assigned;
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "assigned_to_id" = $1, "time_assigned"=$2
  WHERE "id" = $3;`;

  pool.query(queryText, [user_id, time_assigned, task_id])
  .then((result) => res.send(result.rows[0]))
  .catch((err) => {
    console.log("error assigning task to self", err);
    res.sendStatus(500);
  });
});
//user unassigns task from themselves
router.put(`/user_unassign`, (req, res) => {
  
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "assigned_to_id" = null, "time_assigned"=null
  WHERE "id" = $1;`;

  pool.query(queryText, [task_id])
  .then((result) => res.send(result.rows[0]))
  .catch((err) => {
    console.log("error unassigning task to self", err);
    res.sendStatus(500);
  });
});
//user marks task their task complete
router.put(`/user_complete_task`, (req, res) => {
  let time_completed = req.body.time_completed;
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "status" = 'completed', "time_completed"=$1
  WHERE "id" = $2;`;

  pool.query(queryText, [time_completed, task_id])
  .then((result) => res.send(result.rows[0]))
  .catch((err) => {
    console.log("error marking task as complete", err);
    res.sendStatus(500);
  });
});

module.exports = router

