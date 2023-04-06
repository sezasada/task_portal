# FarmWorks

## Problem

Farm in the Dell of the Red River River Valley was tracking their tasks around the farm on a whiteboard. This led to some issues of knowing who was responsible for what and what kind of tasks could be done during a specific day. This app is designed to streamline their process of task management. Helping to delegate tasks and keep track of what tasks are going on and who is doing them.

## Description

Duration: 2.5 weeks (As of April 5th, 2023)

Welcome to FarmWorks! This app is designed for Farm in the Dell of the Red River Valley to help them manage their tasks around the farm. It will be used by some full time staff and lead volunteers. Typical volunteers on the farm will not be using the app but will be assigned to tasks from the aforementioned staff. Also the tasks that will be entered into the app are are typically going to be larger projects and not as much medial farm work tasks.

This application has two different views. Admins are the executive manager and the garden manager of the farm and will have more responsibilities and functionality within the app. Base users are lead volunteers and other full time staff that are not at admin status.

Users must first be approved by an administrator to access the app. They able to select from a master list of tasks that have been created and approved. Once a task has been taken from the list it will be added to the users list. The user with that task has now specified that they will work on it. If the work was complete they can mark the task as complete. If the work is incomplete they can mark it as such and it will be returned to the mater list of tasks. User can also create tasks, these tasks must be approved by an administrator before they are made available.

Administrators have many more features on top of what a normal user has. Admin privileges grant a user the ability to approve tasks as well as user accounts. Admins also have a whole page dedicated to managing users, this is where the user requests are accepted or denied as well as where you can view the information for all of th current users on the app. From here users can be promoted to Admin status or deleted as a whole. At this point deleting a user will delete all tasks they have created or have been assigned to. Admins also have the ability to edit tasks, changing any information they need and they can also assign tasks to other users. When a task is assigned to a user they will be sent an email. Along with this, whenever a user submits a task that needs to be approved the admins will be sent an email. Lastly, the admins can also delete and add new tags and locations. These are pieces of information that can be used when created a task to categorize them.

All users regardless of admin status have access to a profile page where they can edit any of their personal information, change their password and adjust their email preferences. Users do have the option to opt out of emails.

### Prerequisites

- Node.js
- Express
- Redux
- PostgreSQL (version 14 used in this project)
- App to run your database (Postico was used for this project locally)

### Installation

#### Install Node Packages

- Run npm install
- Run the command npm server and the server will start
- Run the command npm run client and the client will boot up and bring you to the page

#### Create Database

- Create database in management software named fitd_db
- Run SQL commands in the database.sql file

### Usage

#### Login/Register

- Users can register on the landing page with their first and last name, phone number,email address, and a password
- Existing users can log in by using their email address and password
- Password reset via sending an email to a valid email address is available to users that forget their passwords

#### Profile

- Any user can edit their first and last name, email address, phone number, password at any time by visiting the profile page

#### Admin View

##### Dashboard

- When logging into your admin account you will first be greeted with the dashboard, this contains to main tables
- The first table is for all tasks that have been submitted and need to be approved
- Clicking on a row containing a task will open a pop-up containing all of the information on a task.
- At the bottom of the pop-up, an admin can select the edit button to adjust any of the information in a task before approving it. Once edits are made the task must be approved and then it becomes available.
- Tasks can also be denied which will delete them from all sources
- The second table is the admins tasks that are assigned to them
- Again, clicking on a row of the table that contains a task will open a pop-up with the task information.
- Tasks can be marked as completed and transferred to the finished tasks list or dropped where they will be added back to the available tasks.
- To leave a comment on the task an admin or user can click the comment icon and leave a comment on the task to inform anyone that might look at the task later of any information that might be important to know
- A history of all the previous comments appears underneath the field where you type a comment

##### Manage Users

- On the Manage Users page the admin can do a few things regarding user access to the application
- The first item displayed on the page is a list of user account requests that need to be approved before those user are able to use the application
- Clicking on a row containing user information will open a pop-up menu containing further information about when the account was created
- Two buttons will also appear at the bottom of the page as well, one to approve a user and give them access to the app and another to deny the user request which will delete the request and the user account as a whole.
- Below the user requests table is a master list of all users that are approved to use the application.
- Clicking on a row in this table will again show a pop-up with that specific users information.
- There are two buttons in this pop-up as well, one which is a toggle to allow or disallow admin privileges as well as to delete a user. Note that deleting a user will also delete all of the tasks that that user is associated with.

##### Manage Tasks

- This page contains many master lists for the admin related to the tasks on the farm.
- The first table is a list of all incomplete tasks. This includes tasks that are of the status "Available" and "In Progress".
- Clicking on one of these tasks brings up its details page
- The administrator can edit the task here as well, alongside having the ability to drop it from a user if it is assigned to someone, or take that task for themselves
- This is also an area where an admin can view and add comments if it is needed
- Below the list of Incomplete tasks is the Completed tasks table
- This holds a record of all tasks completed by anybody on the farm.
- Administrators can view the task info by clicking on one but do not have the ability to edit anything as these tasks just serve as a record for tasks done in the past.
- Below the completed tasks list is an area to manage the existing locations and tags on the farm.
- This gives the administrators the ability to add new tags and locations to the application as they are needed as well as delete any tags that are out of date or are not being used.

##### Create Task

- Admins can create tasks via a form on this page
- The form has required field for a title, location and tags that are associated with a task
- It also has options to add a budget, picture, suggest a due date or add further notes to the task if its required
- Dissimilarly from the user experience the admin is able to assign a task to a user right away as well as they do not need to have their tasks approved to be made available

#### User View

##### Dashboard

- The user dashboard contains three table with the ability to click into any of the tasks listed there and view that task's information
- This first table show all of the user pending, outgoing task requests that are waiting to be approved. Clicking into a task here will just show the details of the task and allow a user to add a comment if need be.
- The next table is a list of all of the tasks that are assigned to that specific user
- Clicking into a task here brings up the details and the options to complete a task, drop a task or leave more comments
- The final table on the page shows a record of all of the tasks that have been completed by that specific user. Again, a user cannot do any interacting with the completed tasks as it is there for a record.

##### Create Task

- Here is where a user will create a new task to be approved by an admin
- The form is virtually the same as the admin create task form, however, users do not have the ability to assign a task to someone and their tasks need to be approved to have access to them

##### Task List

- This page just contains a task list that are of the status Available
- Clicking into a task here gives the user the ability to take a task and put it onto their own list.
- This table also has the ability to sort based on location or tags so the user can effectively find the task that they want to do.

### Built With

- Javascript
- React
- Node
- Express
- Redux
- HTML/XML
- CSS (Material UI)
- SQL for database
- Sendgrid and Cloudinary Web APIs

### Acknowledgement

Thanks so much to everyone at Emerging Prairie especially Katie, Blaine and Mason for amazing instruction and teaching us all that was needed to create a project like this. Also, thanks to our client Anna for giving us great context to the problems they were having on the farm and giving us feedback on the features that would be most effective in this project.
