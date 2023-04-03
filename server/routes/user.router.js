const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();
const crypto = require("crypto");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const moment = require("moment");

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post("/register", (req, res, next) => {
  const password = encryptLib.encryptPassword(req.body.password);
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const phone_number = req.body.phone_number;
  const username = req.body.username;
  const queryText = `INSERT INTO "user" ("first_name", "last_name", "username", "password", "phone_number")
  VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
  pool
    .query(queryText, [first_name, last_name, username, password, phone_number])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

//update user verified status
router.put("/update_verified", async (req, res) => {
  try{
  let current_verified_status = req.body.is_verified;
  let user_id = req.body.id;
  const queryText = `UPDATE "user"
  SET "is_verified" = $1
  WHERE "id"=$2;`;

  await pool.query(queryText, [current_verified_status, user_id]);
  res.sendStatus(200);
    
  }catch(error){
    console.log("update verified status failed", error);
    res.sendStatus(500);

  }
});

//update user admin status
router.put("/update_admin", (req, res) => {
  let current_admin_status = req.body.is_admin;
  let user_id = req.body.id;
  const queryText = `UPDATE "user"
  SET "is_admin" = $1
  WHERE "id"=$2;`;

  pool
    .query(queryText, [current_admin_status, user_id])
    .then(res.sendStatus(200))
    .catch((err) => {
      console.log("update admin status failed", err);
      res.sendStatus(500);
    });
});

//update user admin info
router.put("/update_user", (req, res) => {
  let id = req.user.id;
  let user_info = req.body.user_info;
  const queryText = `UPDATE "user"
  SET "first_name" = $1, "last_name" = $2, "username" = $3, "phone_number" =$4
  WHERE "id"=$5;`;

  pool
    .query(queryText, [
      user_info.first_name,
      user_info.last_name,
      user_info.username,
      user_info.phone_number,
      id,
    ])
    .then(res.sendStatus(200))
    .catch((err) => {
      console.log("update user failed", err);
      res.sendStatus(500);
    });
});

//delete user
router.delete(`/delete_user/:id`, async (req, res) => {
  try{
  let user_id = req.params.id;

   //pull the id of the tasks that were created by or assigned to the user id
   const findTaskIDQuery = `SELECT "id" FROM "tasks" WHERE "assigned_to_id" =$1 OR "created_by_id" =$1;`;
   const result = await pool.query(findTaskIDQuery, [user_id]);

  //Delete  userid  from comments that they posted and delete the comments that are related to the task ids that are being removed
  const commentsQuery = `DELETE FROM "comments" WHERE "posted_by_id" =$1;`;
  await pool.query(commentsQuery, [user_id]);

  const secondCommentsQuery = `DELETE FROM "comments" WHERE "task_id" = $1;`
  for (task of result.rows){
    await pool.query(secondCommentsQuery, [task.id]);
  }
  //Delete from photos the photos that are related to the task ids being removed
  const photosQuery = `DELETE FROM "photos" WHERE "task_id" = $1;`
  for (task of result.rows){
    await pool.query(photosQuery, [task.id]);
  }

  //delete any tags associated with those task ids
  const tagsQuery = `DELETE FROM "tags_per_task" WHERE "task_id" =$1;`
  // console.log("result.rows", result.rows);
  for (task of result.rows){
    await pool.query(tagsQuery, [task.id]);
  }
  //delete the tasks that that user has been assigned to or has created
  const tasksQuery = `DELETE FROM "tasks" WHERE "created_by_id" =$1;`;
  await pool.query(tasksQuery, [user_id]);
  const secondTasksQuery = `DELETE FROM "tasks" WHERE "assigned_to_id" =$1 ;`;
  await pool.query(secondTasksQuery, [user_id]);
  //delete the user
  const queryText = `DELETE FROM "user" WHERE "id" =$1;`;
  await pool.query(queryText, [user_id]);
    
    res.sendStatus(200)
  }catch(error){
    console.error("Error trying to delete user", error);
    res.status(500);
  }

});

// Grab all unverified users
router.get("/unverified", (req, res) => {
  const queryText = `SELECT "id", "first_name", "last_name", "username", "phone_number", "created_at", "is_verified", "is_admin" FROM "user" WHERE "is_verified" = FALSE;`;
  pool
    .query(queryText)
    .then((results) => res.send(results.rows))
    .catch((err) => {
      console.log("Could not retrieve unverified users: ", err);
      res.sendStatus(500);
    });
});

// Grab all verified users
router.get("/verified", (req, res) => {
  const queryText = `SELECT "id", "first_name", "last_name", "username", "phone_number", "created_at", "is_verified", "is_admin", "send_emails" FROM "user" WHERE "is_verified" = TRUE;`;
  pool
    .query(queryText)
    .then((results) => res.send(results.rows))
    .catch((err) => {
      console.log("Could not retrieve verified users: ", err);
      res.sendStatus(500);
    });
});
router.put("/change_password", async (req, res) => {
  try {
    const user_id = req.user.id;
    const password = encryptLib.encryptPassword(req.body.password);

    const queryText = `UPDATE "user"
                       SET "password" = $1 
                       WHERE "id" = $2;`;
    // Update password in the database
    let response = await pool.query(queryText, [password, user_id]);

    res.sendStatus(200);
  } catch (error) {
    console.log("error with reset password", error);
    res.sendStatus(500);
  }
});



//initiate reset password. generate random token and send reset email link
router.put("/reset_password", async (req, res) => {
  try {
    // first do a query to see if the email exists, only send email if it does
    const firstQueryText = `SELECT * FROM "user" WHERE "username" = $1;`;
    
    const username = req.body.email;
    
    const firstResponse = await pool.query(firstQueryText, [username]);
    

    //if response is less than 1, then that email does not exist in our db. do not send a reset token to that email
    if (firstResponse.rows.length < 1) {
      //email does not exist
      res.send("email doesnt exist");
    } else {
      //if response is does exist, then create a token and send the email to reset password

      let randomToken = crypto.randomBytes(20).toString("hex");
      const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

      const queryText = `INSERT INTO password_reset_tokens (email, token, timestamp) 
  VALUES ($1, $2, $3) RETURNING token;`;

      let response = await pool.query(queryText, [
        username,
        randomToken,
        timestamp,
      ]);
      let token = response.rows[0].token;

      let link = `http://localhost:3000/#/reset?${token}`;

      const msg = {
        to: username,
        from: "kathrynszombatfalvy@gmail.com",
        subject: "Farm in the Dell of the Red River Valley Password Reset",
        html: `
    <p>Hello,</p>
    <p>It seems like you forgot your password for Farm in the Dell. If this is true, click the link below to reset your password.</p>
    <a href="${link}">Reset my password</a>
    <p>If you did not forget your password, please disregard this email.</p>
    <p>Thank you.</p>`,
      };

      sgMail
        .send(msg)
        .then(() => {
          // console.log("Email sent");
          res.send("email sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  } catch (error) {
    console.log("error with reset password", error);
    res.sendStatus(500);
  }
});

//router to encrypt new password and save it to the user table
router.put("/set_new_password", async (req, res) => {
  try {
    
    const password = encryptLib.encryptPassword(req.body.password);
    const token = req.body.token;

    const queryText = `UPDATE "user"
  SET "password" = $1 
  WHERE "id" = 2;`;
    //update password in db
    let response = await pool.query(queryText, [password]);

    //delete token from db
    const deleteQueryText = `DELETE FROM "password_reset_tokens"
  WHERE "token" = $1;`;
  await pool.query(deleteQueryText, [token]);


  } catch (error) {
    console.log("error with reset password", error);
    res.sendStatus(500);
  }
});

router.put("/check_if_valid", async (req, res) => {
  try {
    
    const token = req.body.token;

    const queryText = `SELECT * FROM password_reset_tokens WHERE token = $1;`;

    let response = await pool.query(queryText, [token]);
    

    if (response.rows.length < 1) {
      //no matching token found
      
      res.send("invalid");
    } else {
      const timestamp = response.rows[0].timestamp;
      const time_expired = moment(timestamp, "YYYY-MM-DD HH:mm:ss")
        .add(1, "day")
        .format("YYYY-MM-DD HH:mm:ss");
      
      if (moment().isAfter(moment(time_expired, "YYYY-MM-DD HH:mm:ss"))) {
        //link is expired
        
        res.send("expired");
      } else {
        //link is not expired, you can reset your password
        
        res.send(response.rows[0]);
      }
    }
  } catch (error) {
    console.log("error with reset password", error);
    res.sendStatus(500);
  }
});

//update user information
router.put("/update_info", rejectUnauthenticated, (req, res) => {
  const id = req.user.id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const username = req.body.username;
  const phone_number = req.body.phone_number;

  const queryText = `UPDATE "user"
  SET "first_name" = $1, "last_name" = $2, "username" = $3, "phone_number" = $4
  WHERE "id" = $5;`;

  pool
    .query(queryText, [first_name, last_name, username, phone_number, id])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log("update user information failed", err);
      res.sendStatus(500);
    });
});

//update email pref
router.put("/update_email_pref", rejectUnauthenticated, (req, res) => {
  const id = req.user.id;
  
  
  const queryText = `UPDATE "user"
  SET "send_emails" = NOT send_emails
  WHERE "id" = $1`;

  pool
    .query(queryText, [id])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log("update email pref failed", err);
      res.sendStatus(500);
    });
});


module.exports = router;
