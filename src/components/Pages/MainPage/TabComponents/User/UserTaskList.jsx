import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import { useScript } from "../../../../../hooks/useScript";
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
	TextField,
	Autocomplete,
	Box,
	InputAdornment,
	OutlinedInput,
	InputLabel,
	FormControl,
} from "@mui/material";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function UserTaskList() {
	const dispatch = useDispatch();

	// Access redux stores for tasks
	const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
	const allApprovedTasks = useSelector((store) => store.allTasksReducer);
	const allAvailableTasks = useSelector((store) => store.allAvailableTasksReducer);

	// Access redux store for all tags
	const allTags = useSelector((store) => store.allTagsReducer);
	const specificTaskTags = infoOfSpecificTask.tags;

	// Access redux store for all locations
	const allLocations = useSelector((store) => store.allLocationsReducer);

	// Access redux store for all users
	const verifiedUsers = useSelector((store) => store.verifiedUsersReducer);

	const allCompletedTasks = useSelector(
		(store) => store.allCompletedTasksReducer
	);
	const commentsForSpecificTask = infoOfSpecificTask.comments;
	const photosForTask = infoOfSpecificTask.photos;

	// Manage opening and closing of details modal
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



	const handleTakeTask = () => {
		console.log("take task button is clicked", infoOfSpecificTask);
		dispatch({ type: "TAKE_TASK", payload: infoOfSpecificTask });
		handleClose();
	};

	const handleDropTask = () => {
		console.log("drop task clicked", infoOfSpecificTask);
		dispatch({ type: "DROP_TASK", payload: infoOfSpecificTask })
		handleClose();
	};

	console.log("infoOfSpecificTask.user_id:", infoOfSpecificTask.user_id);
	return (
		<Stack spacing={3}>
			<Paper sx={{ p: 3 }}>
				<Typography>Available Tasks</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Location</TableCell>
							<TableCell>Due Date</TableCell>
							<TableCell>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{allAvailableTasks.map((task) => (
							<TableRow
								key={task.id}
								onClick={() => {
									handleOpen();
									dispatch({ type: "VIEW_TASK_INFO", payload: task });
									console.log(task);
								}}
							>
								<TableCell>{task.title}</TableCell>
								<TableCell>{task.location_name}</TableCell>
								<TableCell>
									{" "}
									{task.due_date != null ? 
									moment(task.due_date).format("MMMM Do YYYY, h:mm a")
								: " "}
								</TableCell>
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
							{/* <pre>{JSON.stringify(infoOfSpecificTask)}</pre> */}
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
							Due Date: {infoOfSpecificTask.due_date != null ? 
									moment(infoOfSpecificTask.due_date).format("MMMM Do YYYY, h:mm a")
								: " "}
								</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Created By: {infoOfSpecificTask.created_by_first_name}{" "}
								{infoOfSpecificTask.created_by_last_name}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Assigned To: {infoOfSpecificTask.assigned_to_first_name}{" "}
								{infoOfSpecificTask.assigned_to_last_name}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Notes: {infoOfSpecificTask.notes}
							</Typography>
							{photosForTask &&
								photosForTask.map((item) => {
									return <img src={item.photo_url} width={100} />;
								})}

							<Button variant="contained" onClick={infoOfSpecificTask.assigned_to_first_name ? handleDropTask : handleTakeTask}>
								{infoOfSpecificTask.assigned_to_first_name ? "Drop" : "Take"}
							</Button>
						</Paper>
					</Stack>
				</Modal>
			</Paper>
		</Stack>
	);
}
