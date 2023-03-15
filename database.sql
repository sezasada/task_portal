CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(20) NOT NULL,
	"last_name" varchar(25) NOT NULL,
	"email_address" TEXT NOT NULL,
	"password" varchar(25) NOT NULL,
	"phone_number" int NOT NULL,
	"is_verified" BOOLEAN NOT NULL DEFAULT 'FALSE',
	"is_admin" BOOLEAN NOT NULL DEFAULT 'FALSE'
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
	"assigned_to_id" int NOT NULL REFERENCES "user"("id"),
	"time_created" TIMESTAMP NOT NULL,
	"time_assigned" TIMESTAMP,
	"time_completed" TIMESTAMP,
	"is_time_sensitive" BOOLEAN NOT NULL DEFAULT 'FALSE',
	"due_date" DATE,
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
	"time_posted" TIMESTAMP NOT NULL,
	"content" TEXT NOT NULL,
	"posted_by_id" int NOT NULL REFERENCES "user"("id")
);

CREATE TABLE "photos" (
    "id" serial PRIMARY KEY NOT NULL,
    "task_id" serial NOT NULL REFERENCES "tasks"("id"),
    "photo_link"

);
