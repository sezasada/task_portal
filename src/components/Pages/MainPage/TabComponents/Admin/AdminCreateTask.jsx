import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import { useScript } from "../../../../../hooks/useScript";
import { Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

import {
	Paper,
	Typography,
	Button,
	TextField,
	Autocomplete,
	Box,
	InputAdornment,
	OutlinedInput,
	InputLabel,
	FormControl,
	Alert,
	Snackbar,
} from "@mui/material";
import moment from "moment";
import { IconButton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function AdminCreateTask() {
	const dispatch = useDispatch();

	// Access redux store for all tags
	const allTags = useSelector((store) => store.allTagsReducer);

	// Access redux store for all locations
	const allLocations = useSelector((store) => store.allLocationsReducer);

	// Access redux store for all users
	const verifiedUsers = useSelector((store) => store.verifiedUsersReducer);

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

		dispatch({
			type: "SET_SNACKBAR_MESSAGE",
			payload: <Alert severity="success">Task Added to All Tasks</Alert>,
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
						if (!error && result && result.event === "success") {
							const newPhoto = { photo_url: result.info.secure_url };

							// When an upload is successful, save the uploaded URL to local state!
							setState([...state, newPhoto]);
						}
					}
				)
				.open();
	};

	// -------------- Snackbar Stuff -------------- //
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
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
			spacing={3}
		>
			<Paper
				sx={{
					p: 3,
					maxWidth: "750px",
					width: "90%",
					backgroundColor: "rgb(241, 241, 241)",
				}}
				elevation={3}
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
				<hr />
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
							getOptionLabel={(allLocations) => `${allLocations.location_name}`}
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
							multiline
							rows={4}
						/>
						{/* This just sets up the window.cloudinary widget  */}
						{useScript("https://widget.cloudinary.com/v2.0/global/all.js")}
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Tooltip title="Add a photo" placement="right">
								<IconButton onClick={openWidget}>
									<AddAPhotoIcon />
								</IconButton>
							</Tooltip>
						</Box>

						<Box sx={{ display: "flex", justifyContent: "center" }}>
							{state &&
								state.map((item) => {
									return <img src={item.photo_url} width={100} />;
								})}
						</Box>
						<Tooltip title="Create task">
							<Button
								variant="contained"
								type="submit"
								sx={{
									backgroundColor: "rgb(187, 41, 46)",
									"&:hover": {
										backgroundColor: "rgb(187, 41, 46)",
									},
									width: 300,
								}}
							>
								<AddIcon />
							</Button>
						</Tooltip>
					</Stack>
				</form>
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
