import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import {
	Paper,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Modal,
	Button,
	Box,
} from "@mui/material";
import moment from "moment";

export default function AdminDashboard() {
	const dispatch = useDispatch();

	// Access user reducer
	const user = useSelector((store) => store.user);

	// Access task reducers
	const incomingTasks = useSelector((store) => store.incomingTasksReducer);
	const tasksForAdmin = useSelector((store) => store.allTasksForAdminReducer);

	// Access specific task reducer and tags
	const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
	const specificTaskTags = infoOfSpecificTask.tags;
	const photosForTask = infoOfSpecificTask.photos;

	// Manage opening and closing of first details modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	// Manage opening and closing of second details modal
	const [open2, setOpen2] = useState(false);
	const handleOpen2 = () => {
		setOpen2(true);
	};
	const handleClose2 = () => setOpen2(false);

	return (
		<Stack spacing={3}>
			<Box>
				<Typography component="h2" variant="h4">
					Welcome, {user.first_name}!
				</Typography>
			</Box>
			<Paper sx={{ p: 3 }} elevation={3}>
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
								<TableCell>
									{task.created_by_first_name} {task.created_by_last_name}
								</TableCell>
								<TableCell>
									{moment(task.time_created).format("MMMM Do YYYY, h:mm a")}
								</TableCell>
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
							elevation={3}
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
								Tags:
							</Typography>

							<ul>
								{specificTaskTags &&
									specificTaskTags.map((tag) => (
										<li key={tag.tag_id}>{tag.tag_name}</li>
									))}
							</ul>
							<br />
							<Typography variant="h6" component="h4">
								Budget: ${infoOfSpecificTask.budget}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Location: {infoOfSpecificTask.location_name}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Created By: {infoOfSpecificTask.created_by_first_name}{" "}
								{infoOfSpecificTask.created_by_last_name}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Notes: {infoOfSpecificTask.notes}
							</Typography>
							{photosForTask &&
							photosForTask.map((item) => {
									return <img src={item.photo_url} width={100} />;
								})}
							<Button
								variant="contained"
								onClick={() =>
									dispatch({
										type: "MARK_TASK_APPROVED",
										payload: { task_id: infoOfSpecificTask.task_id },
									})
								}
							>
								Approve
							</Button>
							<Button
								variant="contained"
								onClick={() =>
									dispatch({
										type: "DENY_TASK",
										payload: infoOfSpecificTask.task_id,
									})
								}
							>
								Deny
							</Button>
						</Paper>
					</Stack>
				</Modal>
			</Paper>
			<Paper sx={{ p: 3 }} elevation={3}>
				{/* <pre>{JSON.stringify(tasksForAdmin)}</pre> */}
				<Typography>Tasks assigned to you</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Created By</TableCell>
							<TableCell>Created At</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tasksForAdmin.map((task) => (
							<TableRow
								key={task.id}
								onClick={() => {
									handleOpen2();
									dispatch({ type: "VIEW_TASK_INFO", payload: task });
								}}
							>
								<TableCell>{task.title}</TableCell>
								<TableCell>
									{task.created_by_first_name} {task.created_by_last_name}
								</TableCell>
								<TableCell>
									{moment(task.time_created).format("MMMM Do YYYY, h:mm a")}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Modal
					open={open2}
					onClose={() => {
						handleClose2();
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
							elevation={3}
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
								Tags:
							</Typography>

							<ul>
								{specificTaskTags &&
									specificTaskTags.map((tag) => (
										<li key={tag.tag_id}>{tag.tag_name}</li>
									))}
							</ul>
							<br />
							<Typography variant="h6" component="h4">
								Budget: ${infoOfSpecificTask.budget}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Location: {infoOfSpecificTask.location_name}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Created By: {infoOfSpecificTask.created_by_first_name}{" "}
								{infoOfSpecificTask.created_by_last_name}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Notes: {infoOfSpecificTask.notes}
							</Typography>
							{photosForTask &&
							photosForTask.map((item) => {
									return <img src={item.photo_url} width={100} />;
								})}
							<Button variant="contained">Add Comment</Button>
							<Button variant="contained">Finish</Button>
							<Button variant="contained">Didn't Finish</Button>
						</Paper>
					</Stack>
				</Modal>
			</Paper>
		</Stack>
	);
}
