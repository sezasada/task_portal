const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");
const router = express.Router();


router.get("/location/:location_id", rejectUnauthenticated, async (req, res) => {
  const location_id = req.params.location_id;
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
    WHERE "location_id" = $1 AND "is_approved" = true AND NOT "status" = 'Completed'
    GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
      created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
      assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
      "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
    ;
    `;
    const result = await pool.query(queryText, [location_id]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

router.get("/user/location/:location_id", rejectUnauthenticated, async (req, res) => {
  const location_id = req.params.location_id;
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
    WHERE "location_id" = $1 AND "is_approved" = true AND "status" = 'Available'
    GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
      created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
      assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
      "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
    ;
    `;
    const result = await pool.query(queryText, [location_id]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

router.get("/tags/:tag_id", rejectUnauthenticated, async (req, res) => {
  const tag_id = req.params.tag_id;

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
    LEFT JOIN "tags_per_task" ON "tasks"."id" = "tags_per_task"."task_id"
    LEFT JOIN "tags" ON "tags_per_task"."tag_id" = "tags"."id"
    WHERE "tags"."id" = $1 AND "is_approved" = true AND NOT "status" = 'Completed'
    GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
      created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
      assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
      "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
    ;
    `;
    const result = await pool.query(queryText, [tag_id]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

router.get("/user/tags/:tag_id", rejectUnauthenticated, async (req, res) => {
  const tag_id = req.params.tag_id;

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
    LEFT JOIN "tags_per_task" ON "tasks"."id" = "tags_per_task"."task_id"
    LEFT JOIN "tags" ON "tags_per_task"."tag_id" = "tags"."id"
    WHERE "tags"."id" = $1 AND "is_approved" = true AND "status" = 'Available'
    GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
      created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
      assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
      "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
    ;
    `;
    const result = await pool.query(queryText, [tag_id]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

router.get("/status/:status", rejectUnauthenticated, async (req, res) => {
  const status = req.params.status;

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
    LEFT JOIN "tags_per_task" ON "tasks"."id" = "tags_per_task"."task_id"
    LEFT JOIN "tags" ON "tags_per_task"."tag_id" = "tags"."id"
    WHERE "status" = $1 AND "is_approved" = true AND NOT "status" = 'Completed'
    GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
      created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
      assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
      "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
    ;
    `;
    const result = await pool.query(queryText, [status]);
    res.send(result.rows);
  } catch (error) {
    console.log("error getting task", error);
    res.sendStatus(500);
  }
});

module.exports = router;
