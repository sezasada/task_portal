const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const router = express.Router();

// route to get all tasks that have been approved by a user- history of tasks
router.get("/", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const queryText = `
      SELECT * FROM "tasks"
      WHERE "created_by_id" = $1
      AND "is_approved" = TRUE 
    `;
    const result = await pool.query(queryText, [userId]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to get all tasks that have been approved - for admin
router.get("/approved", rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `
      SELECT * FROM "tasks"
      WHERE "is_approved" = TRUE
    `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to get all tasks that have not been approved - for admin 
router.get('/admin', rejectUnauthenticated, async (req, res) => {

  try {
    const queryText = `
      SELECT * FROM "tasks"
      WHERE "is_approved" = FALSE 
    `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to get all tasks where status is in progress - basically any task that has been approved but is not complete for a specific user
router.get("/user", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const queryText = `
      SELECT * FROM "tasks"
      WHERE "assigned_to_id" = $1
      AND "status" = 'in progress'
    `;
    const result = await pool.query(queryText, [userId]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

router.post("/", rejectUnauthenticated, async (req, res) => {
  try {
    const {
      title,
      notes,
      has_budget,
      budget,
      location_id,
      status,
      time_created,
      is_time_sensitive,
      due_date,
      is_approved,
      assigned_to_id,
    } = req.body;
    const tags = req.body.tags;
    const created_by_id = req.user.id;
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
      title,
      notes,
      has_budget,
      budget,
      location_id,
      status,
      created_by_id,
      assigned_to_id,
      time_created,
      is_time_sensitive,
      due_date,
      is_approved,
    ]);

    const tags_per_task = `
    INSERT INTO "tags_per_task" (
      "task_id",
      "tag_id"
    ) VALUES ($1, $2)
      RETURNING "id"
    `;

    for (let tag of tags) {
      await pool.query(tags_per_task, [
        result.rows[0].id, tag
      ])
    }
    res.send(result.rows[0]);
  } catch (error) {
    console.log("Error creating task", error);
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

  pool
    .query(queryText, [user_id, time_assigned, task_id])
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

  pool
    .query(queryText, [task_id])
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

  pool
    .query(queryText, [time_completed, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error marking task as complete", err);
      res.sendStatus(500);
    });
});

/*ADMIN USER PUT ROUTES*/
//admin assigns task
router.put(`/admin_assign`, (req, res) => {
  let user_id = req.body.user_id;
  let time_assigned = req.body.time_assigned;
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "assigned_to_id" = $1, "time_assigned"=$2
  WHERE "id" = $3;`;

  pool
    .query(queryText, [user_id, time_assigned, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error assigning task to user", err);
      res.sendStatus(500);
    });
});
//admin unassigns task
router.put(`/admin_unassign`, (req, res) => {
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "assigned_to_id" = null, "time_assigned"= null
  WHERE "id" = $1;`;

  pool
    .query(queryText, [task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error unassigning task from user", err);
      res.sendStatus(500);
    });
});
// approve or deny new task - for admin
router.put(`/admin_approve`, (req, res) => {
  let user_id = req.body.user_id;
  let task_id = req.body.task_id;
  let is_approved = req.body.is_approved;

  const queryText = `UPDATE "tasks"
    SET "assigned_to_id" = $1, "is_approved" = $3
    WHERE "id" = $2;`;

  pool
    .query(queryText, [user_id, task_id, is_approved])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error assigning task to user", err);
      res.sendStatus(500);
    });
});

//admin completes any task
router.put(`/admin_complete_task`, (req, res) => {
  let time_completed = req.body.time_completed;
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "status" = 'completed', "time_completed"=$1
  WHERE "id" = $2;`;

  pool
    .query(queryText, [time_completed, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error marking task as complete", err);
      res.sendStatus(500);
    });
});
//admin marks task as incomplete
router.put(`/admin_incomplete_task`, (req, res) => {
  let task_id = req.body.task_id;
  const queryText = `UPDATE "tasks"
  SET "status" = 'available', "time_completed"= null
  WHERE "id" = $1;`;

  pool
    .query(queryText, [task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error marking task as incomplete", err);
      res.sendStatus(500);
    });
});

//admin edits original settings for task
router.put(`/admin_edit_task`, async (req, res) => {
  let title = req.body.title;
  let tags = req.body.tags;
  let notes = req.body.notes;
  let has_budget = req.body.has_budget;
  let budget = req.body.budget;
  let location_id = req.body.location_id;
  let is_time_sensitive = req.body.is_time_sensitive;
  let due_date = req.body.due_date;
  let task_id = req.body.task_id;

  try {
    const queryText = `UPDATE "tasks"
  SET "title" =$1, "notes" =$2, "has_budget" =$3, "budget" =$4, "location_id" =$5, "is_time_sensitive" =$6, "due_date" =$7
  WHERE "id" = $8;`;

    await pool.query(queryText, [
      title,
      notes,
      has_budget,
      budget,
      location_id,
      is_time_sensitive,
      due_date,
      task_id,
    ]);

    const queryDelete = `DELETE FROM "tags_per_task" WHERE "task_id" = $1`;
    await pool.query(queryDelete, [task_id]);

    const queryText2 = `INSERT INTO "tags_per_task" ("task_id", "tag_id")
  VALUES ($1, $2)`;
    for (let tag of tags) {
      await pool.query(queryText2, [task_id, tag]);
    }
    res.sendStatus(200);
  } catch (err) {
    console.log("error editing task", err);
    res.sendStatus(500);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (task.rows.length === 0) {
      console.log("no task is found");
    }
    await pool.query(`DELETE FROM "tasks" WHERE id = $1`, [id]);
    console.log("task is deleted successfully");
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error trying to delete a task", error);
    res.status(500);
  }
});

module.exports = router;
