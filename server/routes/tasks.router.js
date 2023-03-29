const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const router = express.Router();
var moment = require("moment");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

//route to GET all tags
router.get("/tags", (req, res) => {
  const queryText = `SELECT * FROM "tags";`;

  pool
    .query(queryText)
    .then((response) => {
      res.send(response.rows);
    })
    .catch((err) => {
      console.log("error grabbing all tags", err);
      res.sendStatus(500);
    });
});
//route to GET all locations
router.get("/locations", (req, res) => {
  const queryText = `SELECT * FROM "locations";`;

  pool
    .query(queryText)
    .then((response) => {
      res.send(response.rows);
    })
    .catch((err) => {
      console.log("error grabbing all locations", err);
      res.sendStatus(500);
    });
});

// route to GET all tasks that have been completed by a user - history of completed tasks
router.get("/user_completed", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const queryText = `
    SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id" AS "created_by_id",
    created_by."first_name" AS "created_by_first_name",
    created_by."last_name" AS "created_by_last_name",
    created_by."username" AS "created_by_username",
    created_by."phone_number" AS "created_by_phone_number",
    assigned_to."id" AS "assigned_to_id",
    assigned_to."first_name" AS "assigned_to_first_name",
    assigned_to."last_name" AS "assigned_to_last_name",
    assigned_to."username" AS "assigned_to_username",
    assigned_to."phone_number" AS "assigned_to_phone_number",
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name",
   (SELECT json_agg(
         json_build_object(
          'tag_id', "tags"."id",
          'tag_name', "tags"."tag_name"
        )
      )
      FROM "tags_per_task"
      LEFT JOIN "tags" ON "tag_id" = "tags"."id"
      WHERE "task_id" = "tasks"."id"
  ) AS "tags",
   (SELECT json_agg(
         json_build_object(
          'photo_id', "photos"."id",
          'photo_url', "photos"."photo_url"
        )
      )
      FROM "photos"
      WHERE "task_id" = "tasks"."id"
  ) AS "photos"
  ,
  (SELECT json_agg(
         json_build_object(
          'comment_id', "comments"."id",
          'time_posted', "comments"."time_posted",
          'content', "comments"."content",
          'posted_by_first_name', posted_by."first_name",
          'posted_by_last_name', posted_by."last_name",
          'posted_by_username', posted_by."username",
          'posted_by_phone_number', posted_by."phone_number"
        )
      )
      FROM "comments"
      LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
      WHERE "task_id" = "tasks"."id"
  ) AS "comments"
  
  FROM "tasks"
  
  LEFT JOIN "locations" ON "location_id" = "locations"."id"
  LEFT JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
  LEFT JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
  LEFT JOIN "comments" ON "tasks"."id" = "comments"."task_id"
  LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
  LEFT JOIN "photos" ON "photos"."task_id" = "tasks"."id"
  WHERE "status" = 'Completed' AND "assigned_to_id" = $1
  GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
  ;
  `;
    const result = await pool.query(queryText, [userId]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

// route to GET all tasks that have been completed - history of completed tasks
router.get("/admin_completed", rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `
    SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id" AS "created_by_id",
    created_by."first_name" AS "created_by_first_name",
    created_by."last_name" AS "created_by_last_name",
    created_by."username" AS "created_by_username",
    created_by."phone_number" AS "created_by_phone_number",
    assigned_to."id" AS "assigned_to_id",
    assigned_to."first_name" AS "assigned_to_first_name",
    assigned_to."last_name" AS "assigned_to_last_name",
    assigned_to."username" AS "assigned_to_username",
    assigned_to."phone_number" AS "assigned_to_phone_number",
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name",
   (SELECT json_agg(
         json_build_object(
          'tag_id', "tags"."id",
          'tag_name', "tags"."tag_name"
        )
      )
      FROM "tags_per_task"
      LEFT JOIN "tags" ON "tag_id" = "tags"."id"
      WHERE "task_id" = "tasks"."id"
  ) AS "tags",
   (SELECT json_agg(
         json_build_object(
          'photo_id', "photos"."id",
          'photo_url', "photos"."photo_url"
        )
      )
      FROM "photos"
      WHERE "task_id" = "tasks"."id"
  ) AS "photos"
  ,
  (SELECT json_agg(
         json_build_object(
          'comment_id', "comments"."id",
          'time_posted', "comments"."time_posted",
          'content', "comments"."content",
          'posted_by_first_name', posted_by."first_name",
          'posted_by_last_name', posted_by."last_name",
          'posted_by_username', posted_by."username",
          'posted_by_phone_number', posted_by."phone_number"
        )
      )
      FROM "comments"
      LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
      WHERE "task_id" = "tasks"."id"
  ) AS "comments"
  
  FROM "tasks"
  
  LEFT JOIN "locations" ON "location_id" = "locations"."id"
  LEFT JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
  LEFT JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
  LEFT JOIN "comments" ON "tasks"."id" = "comments"."task_id"
  LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
  LEFT JOIN "photos" ON "photos"."task_id" = "tasks"."id"
  WHERE "status" = 'Completed'
  GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
  ;
  
  `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

// route to GET all tasks that have been assigned to a user - user todo list
router.get("/user_assigned_tasks", rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  try {
    const queryText = `
    SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status",
  created_by."id" AS "created_by_id",
  created_by."first_name" AS "created_by_first_name",
  created_by."last_name" AS "created_by_last_name",
  created_by."username" AS "created_by_username",
  created_by."phone_number" AS "created_by_phone_number",
  assigned_to."id" AS "assigned_to_id",
  assigned_to."first_name" AS "assigned_to_first_name",
  assigned_to."last_name" AS "assigned_to_last_name",
  assigned_to."username" AS "assigned_to_username",
  assigned_to."phone_number" AS "assigned_to_phone_number",
  "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name",
 (SELECT json_agg(
       json_build_object(
        'tag_id', "tags"."id",
        'tag_name', "tags"."tag_name"
      )
    )
    FROM "tags_per_task"
    LEFT JOIN "tags" ON "tag_id" = "tags"."id"
    WHERE "task_id" = "tasks"."id"
) AS "tags",
 (SELECT json_agg(
       json_build_object(
        'photo_id', "photos"."id",
        'photo_url', "photos"."photo_url"
      )
    )
    FROM "photos"
    WHERE "task_id" = "tasks"."id"
) AS "photos"
,
(SELECT json_agg(
       json_build_object(
        'comment_id', "comments"."id",
        'time_posted', "comments"."time_posted",
        'content', "comments"."content",
        'posted_by_first_name', posted_by."first_name",
        'posted_by_last_name', posted_by."last_name",
        'posted_by_username', posted_by."username",
        'posted_by_phone_number', posted_by."phone_number"
      )
    )
    FROM "comments"
    LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
    WHERE "task_id" = "tasks"."id"
) AS "comments"

FROM "tasks"

LEFT JOIN "locations" ON "location_id" = "locations"."id"
LEFT JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
LEFT JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
LEFT JOIN "comments" ON "tasks"."id" = "comments"."task_id"
LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
LEFT JOIN "photos" ON "photos"."task_id" = "tasks"."id"
WHERE "assigned_to_id" = $1 AND "is_approved" = TRUE AND NOT "status" = 'Completed'
GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
  created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
  assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
  "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
;

    `;
    const result = await pool.query(queryText, [userId]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to GET all tasks that have been approved by admin and are available to be selected for work
router.get("/approved", rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `
    SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id" AS "created_by_id",
    created_by."first_name" AS "created_by_first_name",
    created_by."last_name" AS "created_by_last_name",
    created_by."username" AS "created_by_username",
    created_by."phone_number" AS "created_by_phone_number",
    assigned_to."id" AS "assigned_to_id",
    assigned_to."first_name" AS "assigned_to_first_name",
    assigned_to."last_name" AS "assigned_to_last_name",
    assigned_to."username" AS "assigned_to_username",
    assigned_to."phone_number" AS "assigned_to_phone_number",
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name",
   (SELECT json_agg(
         json_build_object(
          'tag_id', "tags"."id",
          'tag_name', "tags"."tag_name"
        )
      )
      FROM "tags_per_task"
      LEFT JOIN "tags" ON "tag_id" = "tags"."id"
      WHERE "task_id" = "tasks"."id"
  ) AS "tags",
   (SELECT json_agg(
         json_build_object(
          'photo_id', "photos"."id",
          'photo_url', "photos"."photo_url"
        )
      )
      FROM "photos"
      WHERE "task_id" = "tasks"."id"
  ) AS "photos"
  ,
  (SELECT json_agg(
         json_build_object(
          'comment_id', "comments"."id",
          'time_posted', "comments"."time_posted",
          'content', "comments"."content",
          'posted_by_first_name', posted_by."first_name",
          'posted_by_last_name', posted_by."last_name",
          'posted_by_username', posted_by."username",
          'posted_by_phone_number', posted_by."phone_number"
        )
      )
      FROM "comments"
      LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
      WHERE "task_id" = "tasks"."id"
  ) AS "comments"
  
  FROM "tasks"
  
  LEFT JOIN "locations" ON "location_id" = "locations"."id"
  LEFT JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
  LEFT JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
  LEFT JOIN "comments" ON "tasks"."id" = "comments"."task_id"
  LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
  LEFT JOIN "photos" ON "photos"."task_id" = "tasks"."id"
  WHERE "is_approved" = true
  GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
  ;
  
    `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to GET all tasks that have not been approved - for admin
router.get("/not_approved", rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `
    SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status",
  created_by."id" AS "created_by_id",
  created_by."first_name" AS "created_by_first_name",
  created_by."last_name" AS "created_by_last_name",
  created_by."username" AS "created_by_username",
  created_by."phone_number" AS "created_by_phone_number",
  assigned_to."id" AS "assigned_to_id",
  assigned_to."first_name" AS "assigned_to_first_name",
  assigned_to."last_name" AS "assigned_to_last_name",
  assigned_to."username" AS "assigned_to_username",
  assigned_to."phone_number" AS "assigned_to_phone_number",
  "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name",
 (SELECT json_agg(
       json_build_object(
        'tag_id', "tags"."id",
        'tag_name', "tags"."tag_name"
      )
    )
    FROM "tags_per_task"
    LEFT JOIN "tags" ON "tag_id" = "tags"."id"
    WHERE "task_id" = "tasks"."id"
) AS "tags",
 (SELECT json_agg(
       json_build_object(
        'photo_id', "photos"."id",
        'photo_url', "photos"."photo_url"
      )
    )
    FROM "photos"
    WHERE "task_id" = "tasks"."id"
) AS "photos"
,
(SELECT json_agg(
       json_build_object(
        'comment_id', "comments"."id",
        'time_posted', "comments"."time_posted",
        'content', "comments"."content",
        'posted_by_first_name', posted_by."first_name",
        'posted_by_last_name', posted_by."last_name",
        'posted_by_username', posted_by."username",
        'posted_by_phone_number', posted_by."phone_number"
      )
    )
    FROM "comments"
    LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
    WHERE "task_id" = "tasks"."id"
) AS "comments"

FROM "tasks"

LEFT JOIN "locations" ON "location_id" = "locations"."id"
LEFT JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
LEFT JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
LEFT JOIN "comments" ON "tasks"."id" = "comments"."task_id"
LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
LEFT JOIN "photos" ON "photos"."task_id" = "tasks"."id"
WHERE "is_approved" = false
GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
  created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
  assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
  "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
;

    `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
// route to GET all tasks that have been approved by admin - for admin to track all completed and ongoing tasks - master list
router.get("/all_tasks", rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id" AS "created_by_id",
    created_by."first_name" AS "created_by_first_name",
    created_by."last_name" AS "created_by_last_name",
    created_by."username" AS "created_by_username",
    created_by."phone_number" AS "created_by_phone_number",
    assigned_to."id" AS "assigned_to_id",
    assigned_to."first_name" AS "assigned_to_first_name",
    assigned_to."last_name" AS "assigned_to_last_name",
    assigned_to."username" AS "assigned_to_username",
    assigned_to."phone_number" AS "assigned_to_phone_number",
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name",
   (SELECT json_agg(
         json_build_object(
          'tag_id', "tags"."id",
          'tag_name', "tags"."tag_name"
        )
      )
      FROM "tags_per_task"
      LEFT JOIN "tags" ON "tag_id" = "tags"."id"
      WHERE "task_id" = "tasks"."id"
  ) AS "tags",
   (SELECT json_agg(
         json_build_object(
          'photo_id', "photos"."id",
          'photo_url', "photos"."photo_url"
        )
      )
      FROM "photos"
      WHERE "task_id" = "tasks"."id"
  ) AS "photos"
  ,
  (SELECT json_agg(
         json_build_object(
          'comment_id', "comments"."id",
          'time_posted', "comments"."time_posted",
          'content', "comments"."content",
          'posted_by_first_name', posted_by."first_name",
          'posted_by_last_name', posted_by."last_name",
          'posted_by_username', posted_by."username",
          'posted_by_phone_number', posted_by."phone_number"
        )
      )
      FROM "comments"
      LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
      WHERE "task_id" = "tasks"."id"
  ) AS "comments"
  
  FROM "tasks"
  
  LEFT JOIN "locations" ON "location_id" = "locations"."id"
  LEFT JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
  LEFT JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
  LEFT JOIN "comments" ON "tasks"."id" = "comments"."task_id"
  LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
  LEFT JOIN "photos" ON "photos"."task_id" = "tasks"."id"
  WHERE "is_approved" = true AND NOT "status" = 'Completed'
  GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
  ;
  
  `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

// route to GET all tasks where status is Available.
router.get("/all_available_tasks", rejectUnauthenticated, async (req, res) => {
  try {
    const queryText = `SELECT "tasks"."id" AS "task_id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id" AS "created_by_id",
    created_by."first_name" AS "created_by_first_name",
    created_by."last_name" AS "created_by_last_name",
    created_by."username" AS "created_by_username",
    created_by."phone_number" AS "created_by_phone_number",
    assigned_to."id" AS "assigned_to_id",
    assigned_to."first_name" AS "assigned_to_first_name",
    assigned_to."last_name" AS "assigned_to_last_name",
    assigned_to."username" AS "assigned_to_username",
    assigned_to."phone_number" AS "assigned_to_phone_number",
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name",
   (SELECT json_agg(
         json_build_object(
          'tag_id', "tags"."id",
          'tag_name', "tags"."tag_name"
        )
      )
      FROM "tags_per_task"
      LEFT JOIN "tags" ON "tag_id" = "tags"."id"
      WHERE "task_id" = "tasks"."id"
  ) AS "tags",
   (SELECT json_agg(
         json_build_object(
          'photo_id', "photos"."id",
          'photo_url', "photos"."photo_url"
        )
      )
      FROM "photos"
      WHERE "task_id" = "tasks"."id"
  ) AS "photos"
  ,
  (SELECT json_agg(
         json_build_object(
          'comment_id', "comments"."id",
          'time_posted', "comments"."time_posted",
          'content', "comments"."content",
          'posted_by_first_name', posted_by."first_name",
          'posted_by_last_name', posted_by."last_name",
          'posted_by_username', posted_by."username",
          'posted_by_phone_number', posted_by."phone_number"
        )
      )
      FROM "comments"
      LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
      WHERE "task_id" = "tasks"."id"
  ) AS "comments"
  
  FROM "tasks"
  
  LEFT JOIN "locations" ON "location_id" = "locations"."id"
  LEFT JOIN "user" created_by ON created_by."id" = "tasks"."created_by_id"
  LEFT JOIN "user" assigned_to ON assigned_to."id" = "tasks"."assigned_to_id"
  LEFT JOIN "comments" ON "tasks"."id" = "comments"."task_id"
  LEFT JOIN "user" posted_by ON posted_by."id" = "comments"."posted_by_id"
  LEFT JOIN "photos" ON "photos"."task_id" = "tasks"."id"
  WHERE "is_approved" = true AND "status" = 'Available'
  GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
    created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
    assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
    "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
  ;
  
  `;
    const result = await pool.query(queryText);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});
//post route to add new task
router.post("/admin", rejectUnauthenticated, async (req, res) => {
  console.log("req.body", req.body);
  try {
    const {
      title,
      notes,
      has_budget,
      budget,
      location_id,
      status,
      is_time_sensitive,
      due_date,
      assigned_to_id,
      time_assigned,
    } = req.body;
    const photos = req.body.photos;
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
        "is_time_sensitive",
        "due_date",
        "is_approved",
        "time_assigned"
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
      is_time_sensitive,
      due_date,
      true,
      time_assigned,
    ]);

    const add_photos_query = `INSERT INTO "photos" (
      "task_id", 
      "photo_url"
      )VALUES ($1, $2);`;

    for (let photo of photos) {
      await pool.query(add_photos_query, [result.rows[0].id, photo.photo_url]);
    }

    const tags_per_task = `
    INSERT INTO "tags_per_task" (
      "task_id",
      "tag_id"
    ) VALUES ($1, $2)
      RETURNING "id"
    `;

    for (let tag of tags) {
      await pool.query(tags_per_task, [result.rows[0].id, tag.id]);
    }

    //if assigned_to_id has something, then send an email to that user
    if (assigned_to_id) {
      const userEmail = await pool.query(
        `SELECT "username", "send_emails" FROM "user" WHERE "id" = $1;`,
        [assigned_to_id]
      );
      console.log("userEmail.rows[0].username", userEmail.rows[0].username);
      console.log("userEmail.rows[0].send_emails", userEmail.rows[0].send_emails);
        //only send email if user is set to recieve emails
      if(userEmail.rows[0].send_emails === true){
      const msg = {
        to: userEmail.rows[0].username,
        from: "kathrynszombatfalvy@gmail.com",
        subject: "Task Assigned to You",
        html: `
      <p>Hello,</p>
      <p>A new task has been assigned to you.</p>
      <a href="http://localhost:3000/#/main">View Task</a>
      <p>Thank you.</p>`,
      };
      //send email to the user
      await sgMail.send(msg);
      console.log("Email sent");
    }
  }

    res.send(result.rows[0]);
  } catch (error) {
    console.log("Error creating task", error);
    res.sendStatus(500);
  }
});

router.post("/user", rejectUnauthenticated, async (req, res) => {
  try {
    const {
      title,
      notes,
      has_budget,
      budget,
      location_id,
      status,
      is_time_sensitive,
      due_date,
      assigned_to_id,
      time_assigned,
    } = req.body;
    const photos = req.body.photos;
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
        "is_time_sensitive",
        "due_date"
        
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
      is_time_sensitive,
      due_date,
    ]);

    const add_photos_query = `INSERT INTO "photos" (
      "task_id", 
      "photo_url"
      )VALUES ($1, $2);`;

    for (let photo of photos) {
      await pool.query(add_photos_query, [result.rows[0].id, photo.file_url]);
    }

    const tags_per_task = `
    INSERT INTO "tags_per_task" (
      "task_id",
      "tag_id"
    ) VALUES ($1, $2)
      RETURNING "id"
    `;

    for (let tag of tags) {
      await pool.query(tags_per_task, [result.rows[0].id, tag.id]);
    }
    const results = await pool.query(`SELECT "username", "send_emails" FROM "user"
    WHERE "is_admin" = TRUE AND "send_emails"= 'true';`);

    const adminEmails = results.rows;

    const linkToPortal = "http://localhost:3000/#/main";

    for (email of adminEmails) {
   
      const msg = {
        to: email.username,
        from: "kathrynszombatfalvy@gmail.com",
        subject: "Approval Request for Newly Created Task",
        html: `
  <p>Dear Admin,</p>
  <p>A user has created a new task which requires your approval before further action can be taken. Please log in to the task portal to review the task details.</p>
  <a href="${linkToPortal}">Link to Portal</a>
  <p>Thank you.</p>`,
      };

      await sgMail.send(msg);
    
  }

    res.send(result.rows[0]);
  } catch (error) {
    console.log("Error creating task", error);
    res.sendStatus(500);
  }
});

//post route to add comments to tasks
router.post(`/post_comment`, (req, res) => {
  let task_id = req.body.task_id;
  let content = req.body.content;
  let posted_by_id = req.user.id;

  const queryText = `INSERT INTO comments (task_id, content, posted_by_id)
  VALUES ($1, $2, $3)
  RETURNING "task_id"
  ;`;

  pool
    .query(queryText, [task_id, content, posted_by_id])
    .then((response) => res.send(response.rows).status(201))
    .catch((err) => {
      console.log("error adding comment", err);
      res.sendStatus(500);
    });
});

router.get(`/comments/:task_id`, (req, res) => {
  const task_id = req.params.task_id;
  const queryText = `SELECT "task_id", "comments"."id" AS "comment_id", "time_posted", "content", "posted_by_id", "first_name" AS "posted_by_first_name", "last_name" AS "posted_by_last_name", "username" AS "posted_by_username", "phone_number" AS "posted_by_phone_number" FROM "comments"
  JOIN "user" ON "posted_by_id" = "user"."id"
  WHERE "task_id" = $1;`;
  pool
    .query(queryText, [task_id])
    .then((response) => res.send(response.rows).status(200))
    .catch((err) => {
      console.log("error getting comments", err);
      res.sendStatus(500);
    });
});

//post new location
router.post(`/add_location`, (req, res) => {
  const location_name= req.body.locationName;
  pool.query(`INSERT INTO locations ("location_name")
  VALUES ($1);`, [location_name]).then((response) => res.sendStatus(200)).catch((err) => res.sendStatus(500));
});
//post new tag
router.post(`/add_tag`, (req, res) => {
  const tag_name= req.body.tagName;
  pool.query(`INSERT INTO tags ("tag_name")
  VALUES ($1);`, [tag_name]).then((response) => res.sendStatus(200)).catch((err) => res.sendStatus(500));
});
//delete location
//TODO after deploy make sure that the id you update to is the one marked Other in DB
router.delete(`/delete_location/:id`, async (req, res) =>{
  try{
  const location_id = req.params.id;
  console.log("location_id", location_id);
  await pool.query(`UPDATE "tasks"
  SET "location_id" = 20 WHERE "location_id" = $1;`, [location_id]);
  await pool.query(`DELETE FROM locations WHERE "id"=$1`, [location_id]);
  res.sendStatus(200);
}catch(err){
  console.log("Error deleting location", err);
}
});
//delete tag
//TODO after deploy make sure that the id you update to is the one marked Other in DB
router.delete(`/delete_tag/:id`, async(req, res) =>{
  try{
  const tag_id = req.params.id;
  //update the tags_per_tasks table
  await pool.query(`UPDATE "tags_per_task" SET "tag_id" = 19 WHERE "tag_id" = $1;`, [tag_id]);

  //update the tags table
  await pool.query(`DELETE FROM tags WHERE "id"=$1`, [tag_id]);
  }catch(err){
    console.log("Error deleting tag", err);
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
router.put("/user_complete_task", (req, res) => {
  let time_completed = req.body.time_completed;
  let task_id = req.body.task_id;
  let status = req.body.status;
  const queryText = `UPDATE "tasks"
  SET "status" = $1, "time_completed" = $2
  WHERE "id" = $3;`;

  pool
    .query(queryText, [status, time_completed, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error marking task as complete", err);
      res.sendStatus(500);
    });
});

router.put("/user_status_change", (req, res) => {
  let task_id = req.body.task_id;
  let status = req.body.status;
  const queryText = `UPDATE "tasks"
  SET "status" = $1
  WHERE "id" = $2;`;

  pool
    .query(queryText, [status, task_id])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => {
      console.log("error marking task as complete", err);
      res.sendStatus(500);
    });
});
//I dont think we are using this route
/*ADMIN USER PUT ROUTES*/
//admin assigns task
// router.put(`/admin_assign`, async (req, res) => {

//   try{
//   let user_id = req.body.user_id;
//   let time_assigned = req.body.time_assigned;
//   let task_id = req.body.task_id;
//   const queryText = `UPDATE "tasks"
//   SET "assigned_to_id" = $1, "time_assigned"=$2
//   WHERE "id" = $3;`;

//   const result = await pool.query(queryText, [user_id, time_assigned, task_id]);
//   const userEmail = await pool.query(`SELECT "username" FROM "user" WHERE "id" = $1;`, [user_id]);
//   // console.log("result.rows", result.rows);

//   const msg = {
//     to: userEmail,
//     from: "kathrynszombatfalvy@gmail.com",
//     subject: "Task Assigned to You",
//     html: `
// <p>Hello,</p>
// <p>I new task has been assigned to you.</p>
// <a href="http://localhost:3000/#/main">View Task</a>
// <p>Thank you.</p>`,
//   };
//  //send email to the user
//   await sgMail.send(msg);
//  console.log("Email sent");

//   res.send(result.rows[0])

//   } catch (error){
//     console.log("error with assigning task", error);
//     res.sendStatus(500);
//   }
// });
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
  let task_id = req.body.task_id;

  const queryText = `UPDATE "tasks"
    SET "is_approved" = TRUE
    WHERE "id" = $1;`;

  pool
    .query(queryText, [task_id])
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
  // console.log("just getting into admin edit task, this is req.body", req.body);

  let title = req.body.title;
  let tagObjects = req.body.tags;
  let tags = [];
  tagObjects.map((tag) => tags.push(tag.id));
  let notes = req.body.notes;
  let has_budget = req.body.has_budget;
  let budget = req.body.budget;
  let location_id = req.body.location_id.id;
  let is_time_sensitive = req.body.is_time_sensitive;
  let due_date = req.body.due_date;
  let task_id = req.body.task_id;
  let photos = req.body.photos;
  let assigned_to_id = req.body.assigned_to_id.id;

  if (due_date === "") {
    due_date = null;
  }

  try {
    //first edit the tasks table
    // console.log("in edit task router");
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

    // then delete all photos in the photos table with that task_id

    const deletePhotosQuery = `DELETE FROM "photos" 
    WHERE "task_id" = $1;`;
    await pool.query(deletePhotosQuery, [task_id]);

    // then add all updated photos to the photos table
    const add_photos_query = `INSERT INTO "photos" (
      "task_id", 
      "photo_url"
      )VALUES ($1, $2);`;

    for (let photo of photos) {
      await pool.query(add_photos_query, [task_id, photo.photo_url]);
    }
    // console.log("about to check assigned_to_id", assigned_to_id);
    if (assigned_to_id) {
      //if there is an assiged to, update the assigned to id and time assigned in db
      const assignedQuery = `UPDATE "tasks"
            SET "assigned_to_id" = $1, "time_assigned"=$2, "status"='In Progress'
            WHERE "id" = $3;`;
      const time_assigned = moment().format();

      await pool.query(assignedQuery, [assigned_to_id, time_assigned, task_id]);

      const userEmail = await pool.query(
        `SELECT "username", "send_emails" FROM "user" WHERE "id" = $1;`,
        [assigned_to_id]
      );
      console.log("userEmail.rows[0].username", userEmail.rows[0].username);
      if(userEmail.rows[0].send_emails === true){
      const msg = {
        to: userEmail.rows[0].username,
        from: "kathrynszombatfalvy@gmail.com",
        subject: "Task Assigned to You",
        html: `
      <p>Hello,</p>
      <p>A new task has been assigned to you.</p>
      <a href="http://localhost:3000/#/main">View Task</a>
      <p>Thank you.</p>`,
      };
      //send email to the user
      await sgMail.send(msg);
      console.log("Email sent");
    }
  }

    //then delete all current tags related to this task_id on the tags_per_task table
    const queryDelete = `DELETE FROM "tags_per_task" WHERE "task_id" = $1`;
    await pool.query(queryDelete, [task_id]);

    //then add all updated tags for this task to the tags_per_task table
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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (task.rows.length === 0) {
      // console.log("no task is found");
    }
    await pool.query(`DELETE FROM "comments" WHERE "task_id" = $1`, [id]);
    //delete related photos from photos table
    await pool.query(`DELETE FROM "photos" WHERE "task_id" = $1`, [id]);
    //delete related tags from tags_per_task table
    await pool.query(`DELETE FROM "tags_per_task" WHERE "task_id" = $1`, [id]);
    //delete task from task table
    await pool.query(`DELETE FROM "tasks" WHERE id = $1`, [id]);
    // console.log("task is deleted successfully");
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error trying to delete a task", error);
    res.status(500);
  }
});

module.exports = router;
