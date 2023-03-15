const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
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
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

//update user verified status
router.put('/update_verified', (req, res) => {
  let current_verified_status = req.body.is_verified;
  let user_id = req.body.id;
  const queryText = `UPDATE "user"
  SET "is_verified" = $1
  WHERE "id"=$2;`;

  pool.query(queryText, [!current_verified_status, user_id]).then(res.sendStatus(200))
    .catch((err) => {
      console.log("update verified status failed", err);
      res.sendStatus(500);
    }
    );

});

//update user admin status
router.put('/update_admin', (req, res) => {
  let current_admin_status = req.body.is_admin;
  let user_id = req.body.id;
  const queryText = `UPDATE "user"
  SET "is_admin" = $1
  WHERE "id"=$2;`;

  pool.query(queryText, [!current_admin_status, user_id]).then(res.sendStatus(200))
    .catch((err) => {
      console.log("update admin status failed", err);
      res.sendStatus(500);
    });

});

//update user admin info
router.put('/update_user', (req, res) => {
  let id = req.user.id;
  let user_info = req.body.user_info;
  const queryText = `UPDATE "user"
  SET "first_name" = $1, "last_name" = $2, "username" = $3, "phone_number" =$4
  WHERE "id"=$5;`;

  pool.query(queryText, [user_info.first_name, user_info.last_name, user_info.username, user_info.phone_number, id]).then(res.sendStatus(200))
    .catch((err) => {
      console.log("update user failed", err);
      res.sendStatus(500);
    });

});

//delete user
router.delete(`/delete_user/:id`, (req, res) => {
  let user_id = req.params.id;
  const queryText = `DELETE FROM "user" WHERE "id" =$1;
  `;

  pool.query(queryText, [user_id]).then(res.sendStatus(200))
    .catch((err) => {
      console.log("delete user failed", err);
      res.sendStatus(500);
    }
    );

});

module.exports = router;
