import React, { useState } from "react";
import LogOutButton from "../../Shared/LogOutButton/LogOutButton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
	AppBar,
	Button,
	Modal,
	Paper,
	Stack,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tabs,
	TextField,
	Typography,
	Autocomplete,
} from "@mui/material";
import { Box } from "@mui/system";
function UserPage() {
	const dispatch = useDispatch();

	// Access redux stores for users
	const user = useSelector((store) => store.user);
	const unverifiedUsers = useSelector((store) => store.unverifiedUsersReducer);
	const infoOfSpecificUser = useSelector(
		(store) => store.viewAccountInfoReducer
	);

	// Access redux stores for tasks
	const incomingTasks = useSelector((store) => store.incomingTasksReducer);
	const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
	const allApprovedTasks = useSelector((store) => store.allTasksReducer);

	// Access redux store for all tags
	// const allTags = useSelector((store) => store.allTagsReducer);

	const allTags = [
		{ id: 1, tag_name: "maintenance" },
		{ id: 2, tag_name: "cleaning" },
		{ id: 3, tag_name: "farm work" },
		{ id: 4, tag_name: "administrative" },
	];

	// Manage change in tabs
	const [tabIndex, setTabIndex] = useState(0);

	// Manage Local state for task submission
	const [title, setTitle] = useState("");
	const [tag, setTag] = useState([]);
	const [tagInput, setTagInput] = useState("");

	const handleTabChange = (event, newTabIndex) => {
		setTabIndex(newTabIndex);
	};

	// Manage opening and closing of details modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	useEffect(() => {
		dispatch({ type: "FETCH_UNVERIFIED_USERS" });
		dispatch({ type: "FETCH_INCOMING_TASKS" });
		dispatch({ type: "FETCH_ALL_TASKS" });
	}, []);

	return (
		<div className="container">
			<Box>
				<Tabs value={tabIndex} onChange={handleTabChange}>
					<Tab label="Dashboard" />
					<Tab label="Manage Users" />
					<Tab label="Manage Tasks" />
				</Tabs>
			</Box>
			<Box>
				{tabIndex === 0 && (
					<Stack spacing={3}>
						<h2>Welcome, {user.first_name}!</h2>
						<p>Your ID is: {user.id}</p>
						<Paper sx={{ p: 3 }}>
							{/* <pre>{JSON.stringify(incomingTasks)}</pre> */}
							<Typography>Tasks awaiting approval</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Title</TableCell>
										<TableCell>Created By</TableCell>
										<TableCell>Created At</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{incomingTasks.map((task) => (
										<TableRow
											key={task.id}
											onClick={() => {
												handleOpen();
												dispatch({ type: "VIEW_TASK_INFO", payload: task });
											}}
										>
											<TableCell>{task.title}</TableCell>
											<TableCell>{task.created_by_id}</TableCell>
											<TableCell>{task.time_created}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<Modal
								open={open}
								onClose={() => {
									handleClose();
									dispatch({ type: "UNVIEW_TASK_INFO" });
								}}
							>
								<Stack
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Paper
										sx={{
											display: "flex",
											flexDirection: "column",
											padding: "20px",
										}}
									>
										<Typography
											variant="h4"
											component="h2"
											sx={{ textDecoration: "underline" }}
										>
											Task Info
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Title: {infoOfSpecificTask.title}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Tags: {infoOfSpecificTask.tags}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Budget: ${infoOfSpecificTask.budget}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Location: {infoOfSpecificTask.location_id}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Created By: {infoOfSpecificTask.created_by_id}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Notes: {infoOfSpecificTask.notes}
										</Typography>
										<Button variant="contained">Approve</Button>
										<Button variant="contained">Deny</Button>
									</Paper>
								</Stack>
							</Modal>
						</Paper>
					</Stack>
				)}
				{tabIndex === 1 && (
					<Stack spacing={3}>
						<Paper sx={{ p: 3 }}>
							{/* <pre>{JSON.stringify(unverifiedUsers)}</pre> */}
							<Typography>Users awaiting approval</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Email</TableCell>
										<TableCell>Phone Number</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{unverifiedUsers.map((user) => (
										<TableRow
											key={user.id}
											onClick={() => {
												handleOpen();
												dispatch({ type: "VIEW_ACCOUNT_INFO", payload: user });
											}}
										>
											<TableCell>
												{user.first_name} {user.last_name}
											</TableCell>
											<TableCell>{user.username}</TableCell>
											<TableCell>{user.phone_number}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<Modal
								open={open}
								onClose={() => {
									handleClose();
									dispatch({ type: "UNVIEW_ACCOUNT_INFO" });
								}}
							>
								<Stack
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Paper
										sx={{
											display: "flex",
											flexDirection: "column",
											padding: "20px",
										}}
									>
										<Typography
											variant="h4"
											component="h2"
											sx={{ textDecoration: "underline" }}
										>
											User Info
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Name: {infoOfSpecificUser.first_name}{" "}
											{infoOfSpecificUser.last_name}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Email: {infoOfSpecificUser.username}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Phone Number: {infoOfSpecificUser.phone_number}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Created at:
										</Typography>
										<Button variant="contained">Approve</Button>
										<Button variant="contained">Deny</Button>
									</Paper>
								</Stack>
							</Modal>
						</Paper>
					</Stack>
				)}
				{tabIndex === 2 && (
					<Stack spacing={3}>
						<Paper sx={{ p: 3 }}>
							{/* <pre>{JSON.stringify(allApprovedTasks)}</pre> */}
							<Typography>All Tasks</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Title</TableCell>
										<TableCell>Tags</TableCell>
										<TableCell>Location</TableCell>
										<TableCell>Due Date</TableCell>
										<TableCell>Status</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{allApprovedTasks.map((task) => (
										<TableRow
											key={task.id}
											onClick={() => {
												handleOpen();
												dispatch({ type: "VIEW_TASK_INFO", payload: task });
											}}
										>
											<TableCell>{task.title}</TableCell>
											<TableCell>{task.tags}</TableCell>
											<TableCell>{task.location_id}</TableCell>
											<TableCell>{task.due_date}</TableCell>
											<TableCell>{task.status}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<Modal
								open={open}
								onClose={() => {
									handleClose();
									dispatch({ type: "UNVIEW_TASK_INFO" });
								}}
							>
								<Stack
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Paper
										sx={{
											display: "flex",
											flexDirection: "column",
											padding: "20px",
										}}
									>
										<Typography
											variant="h4"
											component="h2"
											sx={{ textDecoration: "underline" }}
										>
											Task Info
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Title: {infoOfSpecificTask.title}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Tags: {infoOfSpecificTask.tags}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Budget: ${infoOfSpecificTask.budget}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Location: {infoOfSpecificTask.location_id}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Created By: {infoOfSpecificTask.created_by_id}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Notes: {infoOfSpecificTask.notes}
										</Typography>
										<Button variant="contained">Take</Button>
										<Button variant="contained">Mark Complete</Button>
										<Button variant="contained">Edit</Button>
										<Button variant="contained">Delete</Button>
									</Paper>
								</Stack>
							</Modal>
						</Paper>
						<Paper>
							<Stack>
								<Typography>Create a New Task</Typography>
								<form>
									<TextField
										required
										type="text"
										label="Title"
										value={title}
										sx={{
											marginBottom: 1,
											width: 300,
										}}
										onChange={(event) => setTitle(event.target.value)}
										variant="outlined"
									/>
									<Autocomplete
										sx={{
											width: 300,
											marginBottom: 2,
										}}
										multiple
										value={tag}
										onChange={(event, newValue) => setTag(newValue)}
										inputValue={tagInput}
										onInputChange={(event, newInputValue) =>
											setTagInput(newInputValue)
										}
										id="all-tags-lookup"
										getOptionLabel={(allTags) => `${allTags.tag_name}`}
										options={allTags}
										isOptionEqualToValue={(option, value) =>
											option.tag_name === value.tag_name
										}
										noOptionsText={"No valid tags"}
										renderOption={(props, allTags) => (
											<Box component="li" {...props} key={allTags.id}>
												{allTags.tag_name}
											</Box>
										)}
										renderInput={(params) => (
											<TextField {...params} label="Search for Tag" />
										)}
									/>
								</form>
							</Stack>
						</Paper>
					</Stack>
				)}
			</Box>

			<LogOutButton className="btn" />
		</div>
	);
}

// this allows us to use <App /> in index.js
export default UserPage;
