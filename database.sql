CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(20) NOT NULL,
	"last_name" varchar(25) NOT NULL,
	"username" TEXT NOT NULL,
	"password" varchar(80) NOT NULL,
	"phone_number" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"is_verified" BOOLEAN NOT NULL DEFAULT 'FALSE',
	"is_admin" BOOLEAN NOT NULL DEFAULT 'FALSE',
	"send_emails" BOOLEAN NOT NULL DEFAULT 'TRUE'
);

CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_name" varchar(25) NOT NULL
);

CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_name" varchar(75) NOT NULL
);

CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" TEXT NOT NULL,
	"notes" TEXT,
	"has_budget" BOOLEAN NOT NULL DEFAULT 'FALSE',
	"budget" FLOAT,
	"location_id" int NOT NULL REFERENCES "locations"("id"),
	"status" TEXT NOT NULL,
	"created_by_id" int NOT NULL REFERENCES "user"("id"),
	"assigned_to_id" int REFERENCES "user"("id"),
	"time_created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"time_assigned" TIMESTAMP,
	"time_completed" TIMESTAMP,
	"is_time_sensitive" BOOLEAN NOT NULL DEFAULT 'FALSE',
	"due_date" DATE,
	"photo_url" TEXT,
	"has_photo" BOOLEAN NOT NULL DEFAULT FALSE,
	"is_approved" BOOLEAN NOT NULL DEFAULT 'FALSE'
);

CREATE TABLE "tags_per_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" int NOT NULL REFERENCES "tasks"("id"),
	"tag_id" int NOT NULL REFERENCES "tags"("id")
);

CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" serial NOT NULL REFERENCES "tasks"("id"),
	"time_posted" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"content" TEXT NOT NULL,
	"posted_by_id" int NOT NULL REFERENCES "user"("id")
);

CREATE TABLE "photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" int NOT NULL REFERENCES "tasks"("id"),
	"photo_url" TEXT NOT NULL 
);

CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" TEXT,
	"token" TEXT,
	"timestamp" TIMESTAMP
);
ALTER TABLE "password_reset_tokens"
ADD "user_id" INT  NOT NULL;

INSERT INTO "tags" ("tag_name")
VALUES ('Cleaning'), ('Maintenance'), ('Planting'), ('Harvesting'), ('Weeding'), ('Washing'), ('Organizing'), ('Building'), ('Signage'), ('Equipment'), ('Other');

INSERT INTO "locations" ("location_name")
VALUES ('Garden - Section 1A'), ('Garden - Section 1B'), ('Garden - Section 2A'), ('Garden - Section 2B'), ('Garden - Section 3A'), ('Garden - Section 3B'), ('Garden - Section 4A'), ('Garden - Section 4B'), ('Barn'), ('Cold Frame'), ('Office'), ('Wash Pack Area'), ('Strawberry Patch'), ('Asparagus Patch'), ('Parking Lot'), ('Other');

-- HERE IS THE BIGGEST JOIN IN THE WORLD -- 
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
GROUP BY "tasks"."id", "title", "notes", "has_budget", "budget", "location_id", "status",
  created_by."id", created_by."first_name", created_by."last_name", created_by."username", created_by."phone_number", 
  assigned_to."id", assigned_to."first_name", assigned_to."last_name", assigned_to."username", assigned_to."phone_number", 
  "time_created", "time_assigned", "time_completed", "is_time_sensitive", "due_date", "location_name"
;
