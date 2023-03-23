import {
	Button,
	Modal,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	Typography,
	TableRow,
} from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

export default function TasksAwaitingApproval() {
	const dispatch = useDispatch();

	// Access redux stores and define new variables
	const incomingTasks = useSelector((store) => store.incomingTasksReducer);
	const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
	const specificTaskTags = infoOfSpecificTask.tags;
	const photosForTask = infoOfSpecificTask.photos;

	// Manage opening and closing of first details modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	return (
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
						<Typography>
							Due Date:{" "}
							{infoOfSpecificTask.due_date != null
								? moment(infoOfSpecificTask.due_date).format(
										"MMMM Do YYYY, h:mm a"
								  )
								: " "}
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
	);
}
