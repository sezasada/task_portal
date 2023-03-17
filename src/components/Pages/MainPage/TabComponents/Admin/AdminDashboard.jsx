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
} from "@mui/material";

export default function AdminDashboard() {
	const dispatch = useDispatch();

	const user = useSelector((store) => store.user);
	const incomingTasks = useSelector((store) => store.incomingTasksReducer);
	const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);

	const specificTaskTags = infoOfSpecificTask.tags;

	// Manage opening and closing of details modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);
	return (
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
								<TableCell>
									{task.created_by_first_name} {task.created_by_last_name}
								</TableCell>
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
							<Button variant="contained">Approve</Button>
							<Button variant="contained">Deny</Button>
						</Paper>
					</Stack>
				</Modal>
			</Paper>
		</Stack>
	);
}
