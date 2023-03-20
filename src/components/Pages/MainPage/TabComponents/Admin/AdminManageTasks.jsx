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

	// Manage opening and closing of details modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	// Manage Local state for task submission
	const [title, setTitle] = useState("");
	const [tag, setTag] = useState([]);
	const [tagInput, setTagInput] = useState("");
	const [location, setLocation] = useState(allLocations[0]);
	const [locationInput, setLocationInput] = useState("");
	const [budget, setBudget] = useState("");
	const [userLookup, setUserLookup] = useState(verifiedUsers[0]);
	const [userLookupInput, setUserLookupInput] = useState("");
	const [imageLink, setImageLink] = useState("");
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

	function handleSubmitTask(event) {

		console.log("this is state", state);
		event.preventDefault();
		const newTaskObj = {
			title: title,
			notes: notes,
			has_budget: determineIfHasBudget(budget),
			budget: Number(budget),
			location_id: location.id,
			status: "Available",
			is_time_sensitive: moment(validDate).isValid(),
			due_date: moment(validDate).isValid() ? validDate : "",
			assigned_to_id: userLookup?.id,
			photos: state,
		};
		
		// dispatch({ type: "ADD_NEW_TASK", payload: newTaskObj });
		console.log(newTaskObj);
	}

	const [state, setState] = useState([]);

	const openWidget = () => {
      // Currently there is a bug with the Cloudinary <Widget /> component
      // where the button defaults to a non type="button" which causes the form
      // to submit when clicked. So for now just using the standard widget that
      // is available on window.cloudinary
      // See docs: https://cloudinary.com/documentation/upload_widget#look_and_feel_customization
      !!window.cloudinary && window.cloudinary.createUploadWidget(
         {
            sources: ['local', 'url', 'camera'],
            cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
            uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
         },
         (error, result) => {
            console.log(result);
            if (!error && result && result.event === "success") {
               // When an upload is successful, save the uploaded URL to local state!
               setState([...state, {
                  file_url: result.info.secure_url
               }])
			console.log(state);
			   
            }
         },
      ).open();
   }

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
									{moment(task.due_date).format("MMMM Do YYYY, h:mm a")}
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
									<TextField {...params} label="Add Location" />
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
							{/* <TextField
								type="text"
								label="Picture Upload"
								value={imageLink}
								sx={{
									marginBottom: 1,
									width: 300,
								}}
								onChange={(event) => setImageLink(event.target.value)}
								variant="outlined"
							/>

							<p>Upload New File</p>
							{/* This just sets up the window.cloudinary widget */}
							{useScript("https://widget.cloudinary.com/v2.0/global/all.js")}

							<button type="button" onClick={openWidget}>
								Pick File
							</button>
							<br />

            <button type="button" onClick={openWidget}>Pick File</button>
            <br />
            
            {state.length != 0 && state.map((item) => {
				console.log
				return <img src={item.file_url} width={100}/>
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
		</Stack>
	);
}
