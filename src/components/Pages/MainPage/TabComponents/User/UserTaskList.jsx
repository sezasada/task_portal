import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import { useScript } from "../../../../../hooks/useScript";
import ClearIcon from "@mui/icons-material/Clear";
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
	List,
	ListItem,
	TextField,
	Autocomplete,
	Box,
	Card,
	InputAdornment,
	OutlinedInput,
	InputLabel,
	FormControl,
	Select,
	MenuItem,
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
	const allAvailableTasks = useSelector(
		(store) => store.allAvailableTasksReducer
	);
	const sortedTasks = useSelector((store) => store.sortingTasksReducer);

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
	const commentsForSpecificTask = useSelector(
		(store) => store.commentsForTaskReducer
	);
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
		dispatch({ type: "DROP_TASK", payload: infoOfSpecificTask });
		handleClose();
	};

	// Manage opening and closing of child modal for comments modal
	const [openChild, setOpenChild] = useState(false);
	const [comment, setComment] = useState("");
	const handleOpenChild = () => {
		setOpenChild(true);
		dispatch({
			type: "FETCH_COMMENTS_FOR_TASK",
			payload: { task_id: infoOfSpecificTask.task_id },
		});
		console.log("comments", commentsForSpecificTask);
	};
	const handleCloseChild = () => setOpenChild(false);

	function handleSubmitComment() {
		const commentObj = {
			task_id: infoOfSpecificTask.task_id,
			content: comment,
		};
		console.log(commentObj);
		dispatch({ type: "ADD_COMMENT_TO_TASK", payload: commentObj });
		dispatch({
			type: "FETCH_COMMENTS_FOR_TASK",
			payload: { task_id: infoOfSpecificTask.task_id },
		});
		setComment("");
	}

	// ------------- TABLE SORTING --------------- //

	// Manage state for sorting options
	const [sortMode, setSortMode] = useState(false);
	const [sortByLocation, setSortByLocation] = useState("");
	const [sortByTags, setSortByTags] = useState("");

	const activateSortMode = () => {
		setSortMode(true);
	};

	const deactivateSortMode = () => {
		setSortMode(false);
	};

	const handleSort = (type, payload) => {
		console.log("this is the type:", type, "this is the payload:", payload);
		dispatch({ type: type, payload: payload });
	};

	function handleSubmitSort(event, type) {
		if (event.target.value.id === undefined) {
			deactivateSortMode();
			if (type === "FETCH_BY_LOCATION_FOR_USER") {
				setSortByLocation(event.target.value);
			} else if (type === "FETCH_BY_TAGS_FOR_USER") {
				setSortByTags(event.target.value);
			}
			return;
		}

		activateSortMode();
		if (type === "FETCH_BY_LOCATION_FOR_USER") {
			setSortByLocation(event.target.value);
		} else if (type === "FETCH_BY_TAGS_FOR_USER") {
			setSortByTags(event.target.value);
		}

		handleSort(type, event.target.value.id);
	}

	return (
		<Stack spacing={3}>
			<Paper sx={{ p: 3 }}>
				<Typography>Available Tasks</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Location</TableCell>
							<TableCell>Tags</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortMode
							? sortedTasks.map((task) => (
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
											<ul>
												{task.tags &&
													task.tags.map((tag) => (
														<li key={tag.tag_id}> {tag.tag_name} </li>
													))}
											</ul>
										</TableCell>
									</TableRow>
							  ))
							: allAvailableTasks.map((task) => (
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
											<ul>
												{task.tags &&
													task.tags.map((tag) => (
														<li key={tag.tag_id}> {tag.tag_name} </li>
													))}
											</ul>
										</TableCell>
									</TableRow>
							  ))}
					</TableBody>
				</Table>
				<br />
				<Box>
					<Box>
						<FormControl sx={{ width: 300 }}>
							<InputLabel id="sort-by-location-label">
								Sort By Location
							</InputLabel>
							<Select
								id="sort-by-location"
								labelId="sort-by-location-label"
								label="Sort by Location"
								value={sortByLocation}
								onChange={(event) => {
									handleSubmitSort(event, "FETCH_BY_LOCATION_FOR_USER");
									setSortByTags("");
								}}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{allLocations.map((location) => (
									<MenuItem key={location.location_id} value={location}>
										{location.location_name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ width: 300 }}>
							<InputLabel id="sort-by-tags-label">Sort By Tags</InputLabel>
							<Select
								id="sort-by-tags"
								labelId="sort-by-tags-label"
								label="Sort by Tags"
								value={sortByTags}
								onChange={(event) => {
									handleSubmitSort(event, "FETCH_BY_TAGS_FOR_USER");
									setSortByLocation("");
								}}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{allTags.map((tag) => (
									<MenuItem key={tag.id} value={tag}>
										{tag.tag_name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</Box>
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
							<ClearIcon onClick={() => setOpen(false)} />
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
							<Button
								variant="contained"
								onClick={() => {
									handleOpenChild();
								}}
							>
								Comments
							</Button>
							<Button
								variant="contained"
								onClick={
									infoOfSpecificTask.assigned_to_first_name
										? handleDropTask
										: handleTakeTask
								}
							>
								{infoOfSpecificTask.assigned_to_first_name ? "Drop" : "Take"}
							</Button>
						</Paper>
						<Modal
							open={openChild}
							onClose={() => {
								handleCloseChild();
							}}
							sx={{
								overflow: "scroll",
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
										"background-color": "rgb(241, 241, 241)",
                    width: "400px",
									}}
									elevation={3}
								>
									<ClearIcon onClick={() => setOpenChild(false)} />
									{/* <pre>{JSON.stringify(commentsForSpecificTask)}</pre> */}
									<Typography
										variant="h4"
										component="h2"
										sx={{ textDecoration: "underline" }}
									></Typography>
									<br />
									<TextField
										type="text"
										label="Comment"
										value={comment}
										multiline
                    rows={2}
										sx={{
											"margin-left": "2px",
                      "margin-right": "2px",
                      "padding-left": "2px",
                      "padding-right": "2px",
										}}
										onChange={(event) => setComment(event.target.value)}
										variant="outlined"
										InputProps={{
											endAdornment: (
											  <Button
												variant="contained"
												onClick={handleSubmitComment}
											  >
												Send
											  </Button>
											),
										  }}
									/>
									

									<Box>
										<List>
											{commentsForSpecificTask &&
												commentsForSpecificTask.map((comment) => (
													<Card
                            key={comment.comment_id}
                            sx={{
                              margin: "5px",
                              padding: "20px",
                              background: "white",
                            }}
                          >
                            <Box sx={{ fontWeight: "bold" }}>
                              {comment.posted_by_first_name}
                            </Box>
                            <Box sx={{ fontWeight: "light" }}>
                              {moment(comment.time_posted).format(
                                "MMMM DD, YYYY h:mma"
                              )}
                            </Box>
                            <br />
                            {comment.content}{" "}
                          </Card>
												))}
										</List>
									</Box>
									<br />
									
								</Paper>
							</Stack>
						</Modal>
					</Stack>
				</Modal>
			</Paper>
		</Stack>
	);
}
