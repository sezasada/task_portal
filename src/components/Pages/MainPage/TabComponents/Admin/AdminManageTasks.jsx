import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import { useScript } from "../../../../../hooks/useScript";
import { useEffect } from "react";
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

export default function AdminManageTasks() {
	const dispatch = useDispatch();

	// Access redux stores for tasks
	const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
	const allApprovedTasks = useSelector((store) => store.allTasksReducer);

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

	//Manage edit mode
	const [editMode, setEditMode] = useState(false);
	const [editedTitle, setEditedTitle] = useState("");
	const [editedTags, setEditedTags] = useState([]);
	const [editedTagInput, setEditedTagInput] = useState("");
	const [editedLocation, setEditedLocation] = useState(allLocations[0]);
	const [editedLocationInput, setEditedLocationInput] = useState("");
	const [editedBudget, setEditedBudget] = useState("");
	const [editedUserLookup, setEditedUserLookup] = useState(verifiedUsers[0]);
	const [editedUserLookupInput, setEditedUserLookupInput] = useState("");
	const [editedNotes, setEditedNotes] = useState("");
	const [editedDueDate, setEditedDueDate] = useState("");
	const [editedTaskID, setEditedTaskID] = useState("");
	const [editedPhotos, setEditedPhotos] = useState("");
	const [editedAssignedTo, setEditedAssignedTo] = useState("");

	useEffect(() => {
		if (editMode) {
			setEditedTitle(infoOfSpecificTask.title);
			setEditedTags([]);
			setEditedLocation(allLocations[0]);
			setEditedBudget(infoOfSpecificTask.budget);
			setEditedNotes(infoOfSpecificTask.notes);
			setEditedDueDate("");
			setEditedTaskID(infoOfSpecificTask.task_id);
			setEditedPhotos([]);
		} else {
			setEditedTitle("");
			setEditedBudget("");
			setEditedNotes("");
			setEditedDueDate("");
		}
	}, [editMode, allApprovedTasks]);

	const submit_edits = () => {
		let has_budget = determineIfHasBudget(editedBudget);
		let is_time_sensitive;

		editedDueDate == null
			? (is_time_sensitive = false)
			: (is_time_sensitive = true);

		const newObj = {
			title: editedTitle,
			tags: editedTags,
			notes: editedNotes,
			has_budget: has_budget,
			budget: editedBudget,
			location_id: editedLocation,
			is_time_sensitive,
			due_date: editedDueDate,
			task_id: editedTaskID,
			photos: editedPhotos,
			assiged_to_id: editedUserLookup,
		};

		dispatch({ type: "SUBMIT_EDITS", payload: newObj });
		setEditMode(!editMode);
		handleClose();
	};

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

	// Manage Local state for task submission
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState([]);
	const [tagInput, setTagInput] = useState("");
	const [location, setLocation] = useState(allLocations[0]);
	const [locationInput, setLocationInput] = useState("");
	const [budget, setBudget] = useState("");
	const [userLookup, setUserLookup] = useState(verifiedUsers[0]);
	const [userLookupInput, setUserLookupInput] = useState("");
	const [notes, setNotes] = useState("");
	const [dueDate, setDueDate] = useState("");

	// Due date in valid format
	const validDate = moment(dueDate).format("YYYY-MM-DD");

	function determineIfHasBudget(num) {
		let has_budget = false;
		if (num > 0) {
			has_budget = true;
		}
		return has_budget;
	}

	function determineTimeAssigned(userId) {
		let time_assigned;
		if (userId) {
			time_assigned = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
		}
		return time_assigned;
	}

	function handleSubmitTask(event) {
		event.preventDefault();
		const newTaskObj = {
			title: title,
			notes: notes,
			has_budget: determineIfHasBudget(budget),
			budget: Number(budget),
			location_id: location.id,
			status: userLookup?.id ? "In Progress" : "Available",
			is_time_sensitive: moment(validDate).isValid(),
			due_date: moment(validDate).isValid() ? validDate : null,
			assigned_to_id: userLookup?.id,
			photos: state,
			tags: tags,
			time_assigned: determineTimeAssigned(userLookup?.id),
		};

		dispatch({ type: "ADD_NEW_TASK", payload: newTaskObj });

		setTitle("");
		setTags([]);
		setTagInput("");
		setLocation(allLocations[0]);
		setLocationInput("");
		setBudget("");
		setUserLookup(verifiedUsers[0]);
		setUserLookupInput("");
		setNotes("");
		setDueDate("");
		setState([]);
	}

	const [state, setState] = useState([]);

	const openWidget = () => {
		// Currently there is a bug with the Cloudinary <Widget /> component
		// where the button defaults to a non type="button" which causes the form
		// to submit when clicked. So for now just using the standard widget that
		// is available on window.cloudinary
		// See docs: https://cloudinary.com/documentation/upload_widget#look_and_feel_customization
		!!window.cloudinary &&
			window.cloudinary
				.createUploadWidget(
					{
						sources: ["local", "url", "camera"],
						cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
						uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
					},
					(error, result) => {
						
						if (!error && result && result.event === "success") {
							const newPhoto = { photo_url: result.info.secure_url };

							if (!editMode) {
								// When an upload is successful, save the uploaded URL to local state!
								setState([...state, newPhoto]);
								
							} else if (editMode) {
								// When an upload is successful, save the uploaded URL to local state!
								setEditedPhotos([...editedPhotos, newPhoto]);
								
							}
						}
					}
				)
				.open();
	};

	const handleCompleteTask = () => {
		
		dispatch({ type: "COMPLETE_TASK", payload: infoOfSpecificTask });
		handleClose();
	};

	const handleTakeTask = () => {
		
		dispatch({ type: "TAKE_TASK", payload: infoOfSpecificTask });
		handleClose();
	};

	const handleDropTask = () => {
		
		dispatch({ type: "DROP_TASK", payload: infoOfSpecificTask });
		handleClose();
	};
	const handleDeny = () => {
		
		dispatch({
			type: "DENY_TASK",
			payload: infoOfSpecificTask,
		});
		handleClose();
	};

	
	return (
		<Stack spacing={3}>
			<Paper sx={{ p: 3 }}>
				<Typography>All Tasks</Typography>
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
						{allApprovedTasks.map((task) => (
							<TableRow
								key={task.id}
								onClick={() => {
									handleOpen();
									dispatch({ type: "VIEW_TASK_INFO", payload: task });
									
								}}
							>
								<TableCell>{task.title}</TableCell>
								<TableCell>{task.location_name}</TableCell>
								<TableCell>
									{" "}
									{task.due_date != null
										? moment(task.due_date).format("MMMM Do YYYY, h:mm a")
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
								Title: {""}
								{editMode ? (
									<TextField
										required
										type="text"
										label="Title"
										value={editedTitle}
										sx={{
											marginBottom: 1,
											width: 300,
										}}
										variant="outlined"
										onChange={(event) => setEditedTitle(event.target.value)}
									/>
								) : (
									infoOfSpecificTask.title
								)}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Tags:{""}
							</Typography>

							{editMode ? (
								<Autocomplete
									sx={{
										width: 300,
										marginBottom: 1,
									}}
									multiple
									value={editedTags}
									onChange={(event, newValue) => setEditedTags(newValue)}
									inputValue={editedTagInput}
									onInputChange={(event, newInputValue) =>
										setEditedTagInput(newInputValue)
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
										<TextField {...params} label="Add Tags" />
									)}
								/>
							) : (
								<ul>
									{specificTaskTags &&
										specificTaskTags.map((tag) => (
											<li key={tag.tag_id}>{tag.tag_name}</li>
										))}
								</ul>
							)}
							<br />
							<Typography variant="h6" component="h4">
								Budget: {""}
								{editMode ? (
									<>
										<InputLabel htmlFor="budget-input">Budget</InputLabel>
										<OutlinedInput
											type="number"
											id="budget-input"
											label="Budget"
											value={editedBudget}
											sx={{
												marginBottom: 1,
												width: 300,
											}}
											onChange={(event) => setEditedBudget(event.target.value)}
											variant="outlined"
											startAdornment={
												<InputAdornment position="start">$</InputAdornment>
											}
										/>
									</>
								) : (
									`$${infoOfSpecificTask.budget}`
								)}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Location: {""}
								{editMode ? (
									<Autocomplete
									required
										sx={{
											width: 300,
											marginBottom: 1,
										}}
										value={editedLocation}
										onChange={(event, newValue) => setEditedLocation(newValue)}
										inputValue={editedLocationInput}
										onInputChange={(event, newInputValue) =>
											setEditedLocationInput(newInputValue)
										}
										id="all-locations-lookup"
										getOptionLabel={(allLocations) =>
											`${allLocations.location_name}`
										}
										options={allLocations}
										isOptionEqualToValue={(option, value) =>
											option.location_name === value.location_name
										}
										noOptionsText={"No valid locations"}
										renderOption={(props, allLocations) => (
											<Box component="li" {...props} key={allLocations.id}>
												{allLocations.location_name}
											</Box>
										)}
										renderInput={(params) => (
											<TextField {...params} label="Add Location" required />
										)}
									/>
								) : (
									infoOfSpecificTask.location_name
								)}
							</Typography>
							<br />

							<Typography>
								Due Date:{" "}
								{editMode ? (
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<DatePicker
											value={editedDueDate}
											sx={{ marginBottom: 1, width: 300 }}
											onChange={(newValue) => setEditedDueDate(newValue)}
										/>
									</LocalizationProvider>
								) : infoOfSpecificTask.due_date != null ? (
									moment(infoOfSpecificTask.due_date).format(
										"MMMM Do YYYY, h:mm a"
									)
								) : (
									" "
								)}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Created By: {infoOfSpecificTask.created_by_first_name}{" "}
								{infoOfSpecificTask.created_by_last_name}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Assigned To: {""}
								{editMode ? (
									<Autocomplete
										sx={{
											width: 300,
											marginBottom: 1,
										}}
										value={editedUserLookup}
										onChange={(event, newValue) => {
											
											setEditedUserLookup(newValue);
										}}
										inputValue={editedUserLookupInput}
										onInputChange={(event, newInputValue) =>
											setEditedUserLookupInput(newInputValue)
										}
										id="all-verified-users-lookup"
										getOptionLabel={(verifiedUsers) =>
											`${verifiedUsers.first_name} ${verifiedUsers.last_name}`
										}
										options={verifiedUsers}
										isOptionEqualToValue={(option, value) =>
											option.first_name === value.first_name
										}
										noOptionsText={"No valid users"}
										renderOption={(props, verifiedUsers) => (
											<Box component="li" {...props} key={verifiedUsers.id}>
												{verifiedUsers.first_name} {verifiedUsers.last_name}
											</Box>
										)}
										renderInput={(params) => (
											<TextField {...params} label="Assign to User" />
										)}
									/>
								) : infoOfSpecificTask.assigned_to_first_name == null ? (
									" "
								) : (
									`${infoOfSpecificTask.assigned_to_first_name}
					${infoOfSpecificTask.assigned_to_last_name}`
								)}
							</Typography>
							<br />
							<Typography variant="h6" component="h4">
								Notes: {""}
								{editMode ? (
									<TextField
										type="text"
										label="Notes"
										value={editedNotes}
										sx={{
											marginBottom: 1,
											width: 300,
										}}
										onChange={(event) => setEditedNotes(event.target.value)}
										variant="outlined"
									/>
								) : (
									`${infoOfSpecificTask.notes}`
								)}
							</Typography>
							{editMode ? (
								<>
									{/* This just sets up the window.cloudinary widget
                  {useScript(
                    "https://widget.cloudinary.com/v2.0/global/all.js"
                  )} */}

									<Button
										variant="contained"
										type="button"
										onClick={openWidget}
										sx={{ width: 300 }}
									>
										Pick File
									</Button>
									
									{editedPhotos &&
										editedPhotos.map((item) => {
											return <img src={item.photo_url} width={100} />;
										})
									
										}
								</>
							) : (
								<>
									{photosForTask != null &&
										photosForTask.map((item) => {
											return <img src={item.photo_url} width={100} />;
										})}
								</>
							)}

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
							{/* <Button variant="contained" onClick={handleTakeTask}
							>
								Take
							</Button> */}
							<Button variant="contained" onClick={handleCompleteTask}>
								Mark Complete
							</Button>

							{editMode ? (
								<Button variant="contained" onClick={() => submit_edits()}>
									Submit Changes
								</Button>
							) : (
								<Button
									variant="contained"
									onClick={() => setEditMode(!editMode)}
								>
									Edit
								</Button>
							)}

							<Button variant="contained" onClick={handleDeny}>
								Delete
							</Button>
						</Paper>
					</Stack>
				</Modal>
			</Paper>
			<Paper>
				<Stack>
					<Typography>Create a New Task</Typography>
					<form onSubmit={handleSubmitTask}>
						<Stack>
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
									marginBottom: 1,
								}}
								multiple
								value={tags}
								onChange={(event, newValue) => setTags(newValue)}
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
									<TextField {...params} label="Add Tags" />
								)}
							/>
							<Autocomplete
								
								sx={{
									width: 300,
									marginBottom: 1,
								}}
								value={location}
								onChange={(event, newValue) => setLocation(newValue)}
								inputValue={locationInput}
								onInputChange={(event, newInputValue) =>
									setLocationInput(newInputValue)
								}
								id="all-locations-lookup"
								getOptionLabel={(allLocations) =>
									`${allLocations.location_name}`
								}
								options={allLocations}
								isOptionEqualToValue={(option, value) =>
									option.location_name === value.location_name
								}
								noOptionsText={"No valid locations"}
								renderOption={(props, allLocations) => (
									<Box component="li" {...props} key={allLocations.id}>
										{allLocations.location_name}
									</Box>
								)}
								renderInput={(params) => (
									<TextField {...params} label="Add Location"  required/>
								)}
							/>
							<Autocomplete
								sx={{
									width: 300,
									marginBottom: 1,
								}}
								value={userLookup}
								onChange={(event, newValue) => setUserLookup(newValue)}
								inputValue={userLookupInput}
								onInputChange={(event, newInputValue) =>
									setUserLookupInput(newInputValue)
								}
								id="all-verified-users-lookup"
								getOptionLabel={(verifiedUsers) =>
									`${verifiedUsers.first_name} ${verifiedUsers.last_name}`
								}
								options={verifiedUsers}
								isOptionEqualToValue={(option, value) =>
									option.first_name === value.first_name
								}
								noOptionsText={"No valid users"}
								renderOption={(props, verifiedUsers) => (
									<Box component="li" {...props} key={verifiedUsers.id}>
										{verifiedUsers.first_name} {verifiedUsers.last_name}
									</Box>
								)}
								renderInput={(params) => (
									<TextField {...params} label="Assign to User" />
								)}
							/>
							<FormControl>
								<InputLabel htmlFor="budget-input">Budget</InputLabel>
								<OutlinedInput
									type="number"
									id="budget-input"
									label="Budget"
									value={budget}
									sx={{
										marginBottom: 1,
										width: 300,
									}}
									onChange={(event) => setBudget(event.target.value)}
									variant="outlined"
									startAdornment={
										<InputAdornment position="start">$</InputAdornment>
									}
								/>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<DatePicker
										sx={{ marginBottom: 1, width: 300 }}
										value={dueDate}
										onChange={(newValue) => setDueDate(newValue)}
									/>
								</LocalizationProvider>
							</FormControl>

							<p>Upload New File</p>
							{/* This just sets up the window.cloudinary widget */}
							{useScript("https://widget.cloudinary.com/v2.0/global/all.js")}

							<Button
								variant="contained"
								type="button"
								onClick={openWidget}
								sx={{ width: 300 }}
							>
								Pick File
							</Button>
							<br />
	
							{state &&
								state.map((item) => {
									
									return <img src={item.photo_url} width={100} />;
								})}
							<br />
							<TextField
								type="text"
								label="Notes"
								value={notes}
								sx={{
									marginBottom: 1,
									width: 300,
								}}
								onChange={(event) => setNotes(event.target.value)}
								variant="outlined"
							/>
							<Button
								variant="contained"
								type="submit"
								sx={{
									marginBottom: 1,
									width: 300,
								}}
							>
								Submit
							</Button>
						</Stack>
					</form>
				</Stack>
			</Paper>
			<Paper sx={{ p: 3 }} elevation={3}>
				{/* <pre>{JSON.stringify(allCompletedTasks)}</pre> */}
				<Typography>All Completed Tasks</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Completed At</TableCell>
							<TableCell>Completed By</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{allCompletedTasks.map((task) => (
							<TableRow
								key={task.id}
								onClick={() => {
									handleOpen2();
									dispatch({ type: "VIEW_TASK_INFO", payload: task });
								}}
							>
								<TableCell>{task.title}</TableCell>
								<TableCell>
									{task.assigned_to_first_name} {task.assigned_to_last_name}
								</TableCell>
								<TableCell>
									{moment(task.time_completed).format("MMMM Do YYYY, h:mm a")}
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
							<Typography variant="h6" component="h4">
								Assigned To: {infoOfSpecificTask.assigned_to_first_name}{" "}
								{infoOfSpecificTask.assigned_to_last_name}
							</Typography>
							<br />
							<br />
							<Typography variant="h6" component="h4">
								Notes: {infoOfSpecificTask.notes}
							</Typography>
							{photosForTask ? (
								<Typography variant="h6" component="h4">
									Photos:
								</Typography>
							) : (
								""
							)}
							{photosForTask &&
								photosForTask.map((item) => {
									return <img src={item.photo_url} width={100} />;
								})}
							<Typography variant="h6" component="h4">
								Comments:
							</Typography>
							<ul>
								{commentsForSpecificTask &&
									commentsForSpecificTask.map((comment) => (
										<li key={comment.comment_id}>
											{comment.posted_by_first_name} said: {comment.content} on{" "}
											{moment(comment.time_posted).format(
												"MMMM Do YYYY, h:mm a"
											)}
										</li>
									))}
							</ul>
						</Paper>
					</Stack>
				</Modal>
			</Paper>
		</Stack>
	);
}
