import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import { useScript } from "../../../../../hooks/useScript";
import {
	Paper,
	Typography,
	Button,
	TextField,
	Autocomplete,
	Box,
	InputAdornment,
	FormControl,
	Snackbar,
	Alert,
} from "@mui/material";
import moment from "moment";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function UserCreateTask() {
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
			status: "Available",
			is_time_sensitive: moment(validDate).isValid(),
			due_date: moment(validDate).isValid() ? validDate : null,
			photos: state,
			tags: tags,
			time_assigned: determineTimeAssigned(userLookup?.id),
		};

		dispatch({ type: "ADD_NEW_TASK_USER", payload: newTaskObj });
		console.log(newTaskObj);
		setTitle("");
		setTags([]);
		setTagInput("");
		setLocation(allLocations[0]);
		setLocationInput("");
		setBudget("");
		setNotes("");
		setDueDate("");
		setState([]);

		dispatch({
			type: "SET_SNACKBAR_MESSAGE",
			payload: <Alert severity="success">Submitted for Approval</Alert>,
		});
		handleOpenSnackbar();
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
						console.log(result);
						if (!error && result && result.event === "success") {
							// When an upload is successful, save the uploaded URL to local state!
							setState([
								...state,
								{
									file_url: result.info.secure_url,
								},
							]);
							console.log(state);
						}
					}
				)
				.open();
	};

	console.log("infoOfSpecificTask.user_id:", infoOfSpecificTask.user_id);

	// ------------------- Snackbar stuff ---------------------- //
	const [openSnackbar, setOpenSnackbar] = useState(false);

	const snackbarMessage = useSelector((store) => store.snackbarMessageReducer);

	const handleOpenSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSnackbar(false);
	};

	return (
		<Stack
			sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
			spacing={3}
		>
			<Paper
				sx={{
					p: 3,
					maxWidth: "35vh",
					width: "90%",
					backgroundColor: "rgb(241, 241, 241)",
				}}
				elevation={3}
			>
				<Stack
					sx={{
						backgroundColor: "rgb(241, 241, 241)",
						
					}}
				>
					<Typography
						sx={{
							fontSize: "3vh",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							color: "rgb(187, 41, 46)",
						}}
					>
						Create a New Task
					</Typography>
					<form
						onSubmit={handleSubmitTask}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							
						}}
					>
						<Stack>
							<TextField
								required
								type="text"
								label="Title"
								value={title}
								sx={{
									marginBottom: 1,
									"& .MuiOutlinedInput-root": {
										"& fieldset": {
											borderColor: "grey",
										},
										"&.Mui-focused fieldset": {
											borderColor: "black",
										},
									},
									"& .MuiFormLabel-root.Mui-focused": {
										color: "rgb(187, 41, 46)",
									},
								}}
								onChange={(event) => setTitle(event.target.value)}
								variant="outlined"
							/>
							<Autocomplete
								sx={{
									marginBottom: 1,
									"& .MuiOutlinedInput-root": {
										"& fieldset": {
											borderColor: "grey",
										},
										"&.Mui-focused fieldset": {
											borderColor: "black",
										},
									},
									"& .MuiFormLabel-root.Mui-focused": {
										color: "rgb(187, 41, 46)",
									},
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
									marginBottom: 1,
									"& .MuiOutlinedInput-root": {
										"& fieldset": {
											borderColor: "grey",
										},
										"&.Mui-focused fieldset": {
											borderColor: "black",
										},
									},
									"& .MuiFormLabel-root.Mui-focused": {
										color: "rgb(187, 41, 46)",
									},
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
							<FormControl>
								<TextField
									type="number"
									label="Budget"
									value={budget}
									sx={{
										marginBottom: 1,
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "grey",
											},
											"&.Mui-focused fieldset": {
												borderColor: "black",
											},
										},
										"& .MuiFormLabel-root.Mui-focused": {
											color: "rgb(187, 41, 46)",
										},
									}}
									onChange={(event) => setBudget(event.target.value)}
									variant="outlined"
									startAdornment={
										<InputAdornment position="start">$</InputAdornment>
									}
								/>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<DatePicker
										sx={{
											marginBottom: 1,
											"& .MuiOutlinedInput-root": {
												"& fieldset": {
													borderColor: "grey",
												},
												"&.Mui-focused fieldset": {
													borderColor: "black",
												},
											},
											"& .MuiFormLabel-root.Mui-focused": {
												color: "rgb(187, 41, 46)",
											},
										}}
										value={dueDate}
										onChange={(newValue) => setDueDate(newValue)}
									/>
								</LocalizationProvider>
							</FormControl>

					
							{/* This just sets up the window.cloudinary widget */}
							{useScript("https://widget.cloudinary.com/v2.0/global/all.js")}
							<Box sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
							<Button
								variant="contained"
								type="button"
								onClick={openWidget}
								sx={{
									width:"100px",
									backgroundColor: "rgb(187, 41, 46)",
									"&:hover": {
										backgroundColor: "rgb(187, 41, 46)",
										transform: "scale(1.03)",
									},
								}}
							>
								<AddAPhotoIcon />
							</Button>
							</Box>
							
							{state.length != 0 &&
								state.map((item) => {
									console.log;
									return <img src={item.file_url} width={100} />;
								})}
							<br />
							<TextField
								type="text"
								label="Notes"
								value={notes}
								sx={{
									marginBottom: 1,
									"& .MuiOutlinedInput-root": {
										"& fieldset": {
											borderColor: "grey",
										},
										"&.Mui-focused fieldset": {
											borderColor: "black",
										},
									},
									"& .MuiFormLabel-root.Mui-focused": {
										color: "rgb(187, 41, 46)",
									},
								}}
								onChange={(event) => setNotes(event.target.value)}
								variant="outlined"
								multiline
								rows={4}
							/>
							<Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
							<Button
								variant="contained"
								type="submit"
								sx={{
									backgroundColor: "rgb(187, 41, 46)",
									"&:hover": {
										backgroundColor: "rgb(187, 41, 46)",
										transform: "scale(1.03)",
									},
									width: "100px",
								}}
							>
								<AddIcon />
							</Button>
							</Box>
						</Stack>
					</form>
				</Stack>
			</Paper>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
			>
				{snackbarMessage}
			</Snackbar>
		</Stack>
	);
}
