import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import {
	Paper,
	Card,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Modal,
	Button,
	Box,
	TextField,
	List,
	ListItem,
	IconButton,
	Snackbar,
	Alert,
} from "@mui/material";
import moment from "moment";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";

export default function UserDashboard() {
	const dispatch = useDispatch();

	// Access user reducer
	const user = useSelector((store) => store.user);

	// Access task reducers
	const incomingTasks = useSelector((store) => store.incomingTasksReducer);
	const tasksForAdmin = useSelector((store) => store.allTasksForAdminReducer);
	const commentsForTask = useSelector((store) => store.commentsForTaskReducer);

	// Access specific task reducer and tags
	const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
	const specificTaskTags = infoOfSpecificTask.tags;
	const photosForTask = infoOfSpecificTask.photos;
	const allCompletedTasks = useSelector(
		(store) => store.allCompletedTasksReducer
	);
	const userCompletedTasks = useSelector(
		(store) => store.allCompletedUserTaskReducer
	);
	const [comment, setComment] = useState("");

	// Manage opening and closing of first details modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	// Manage opening and closing of second details modal

	const [open3, setOpen3] = useState(false);
	const handleOpen3 = () => {
		setOpen3(true);
	};
	const handleClose3 = () => setOpen3(false);

	const [open2, setOpen2] = useState(false);
	const handleOpen2 = () => {
		setOpen2(true);
	};
	const handleClose2 = () => setOpen2(false);

	// Manage opening and closing of child modal for comments modal
	const [openChild, setOpenChild] = useState(false);
	const handleOpenChild = () => {
		setOpenChild(true);
		dispatch({
			type: "FETCH_COMMENTS_FOR_TASK",
			payload: { task_id: infoOfSpecificTask.task_id },
		});
		console.log("comments", commentsForTask);
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

	const handleDropTask = () => {
		console.log("drop task clicked", infoOfSpecificTask);
		dispatch({ type: "DROP_TASK", payload: infoOfSpecificTask });
		handleClose2();
		dispatch({
			type: "SET_SNACKBAR_MESSAGE",
			payload: <Alert severity="error">Task Dropped</Alert>,
		});
		handleOpenSnackbar();
	};

	const handleCompleteTask = () => {
		console.log("infoOfSpecificTask:", infoOfSpecificTask);
		dispatch({ type: "COMPLETE_TASK", payload: infoOfSpecificTask });
		handleClose2();
		dispatch({
			type: "SET_SNACKBAR_MESSAGE",
			payload: <Alert severity="success">Task Completed</Alert>,
		});
		handleOpenSnackbar();
	};
	console.log("user tasks", userCompletedTasks);
	console.log("admin tasks", allCompletedTasks);

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

	const action = (
		<>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleCloseSnackbar}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</>
	);
	return (
		<Stack
			spacing={3}
			sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
		>
			{/* <Box>
        <Typography component="h5" variant="h5">
          Welcome, {user.first_name}!
        </Typography>
      </Box> */}
			<Paper
				sx={{
					p: 3,
					maxWidth: "750px",
					width: "90%",
					backgroundColor: "rgb(241, 241, 241)",
				}}
				elevation={3}
			>
				{/* <pre>{JSON.stringify(incomingTasks)}</pre> */}
				<Typography
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						fontSize: "3vh",
						color: "rgb(187, 41, 46)",
					}}
				>
					Tasks awaiting approval
				</Typography>
				<hr />
				<Table
					sx={{
						"& thead th:first-child": {
							width: "55%",
						},
						"& thead th:last-child": {
							width: "45%",
						},
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
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
									{moment(task.time_created).format("MMMM DD YYYY, h:mm a")}
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
					sx={{
						margin: "0 auto",

						width: "90%",
						maxWidth: "750px",
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
								width: "90%",
								padding: "40px",
								backgroundColor: "rgb(241, 241, 241)",
							}}
							elevation={3}
						>
							<ClearIcon onClick={() => setOpen(false)} />
							<Typography
								variant="h4"
								component="h2"
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									color: "rgb(187, 41, 46)",
									borderBottom: "1px solid grey",
								}}
							>
								Task Info
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Title: {infoOfSpecificTask.title}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Tags:
							</Typography>
							<ul>
								{specificTaskTags &&
									specificTaskTags.map((tag) => (
										<li key={tag.tag_id}>{tag.tag_name}</li>
									))}
							</ul>

							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Budget: ${infoOfSpecificTask.budget}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Location: {infoOfSpecificTask.location_name}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Due Date:{" "}
								{infoOfSpecificTask.due_date != null
									? moment(infoOfSpecificTask.due_date).format(
											"MMMM DD YYYY, h:mm a"
									  )
									: " "}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
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
								sx={{ backgroundColor: "rgb(187, 41, 46)" }}
								onClick={() => {
									handleOpenChild();
								}}
							>
								Comments
							</Button>
						</Paper>
						<Modal
							open={openChild}
							onClose={() => {
								handleCloseChild();
							}}
							sx={{
								margin: "0 auto",
								width: "90%",
								maxWidth: "750px",
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
										width: "90%",
										padding: "40px",
										backgroundColor: "rgb(241, 241, 241)",
									}}
									elevation={3}
								>
									{/* <pre>{JSON.stringify(commentsForTask)}</pre> */}
									<ClearIcon onClick={() => setOpenChild(false)} />
									<Typography
										variant="h4"
										component="h2"
										sx={{ textDecoration: "underline" }}
									></Typography>
									<br />
									<TextField
										type="text"
										label="Add a comment..."
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
											{commentsForTask.length > 0 &&
												commentsForTask.map((comment) => (
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
								</Paper>
							</Stack>
						</Modal>
					</Stack>
				</Modal>
			</Paper>
			<Paper
				sx={{
					p: 3,
					maxWidth: "750px",
					width: "90%",
					backgroundColor: "rgb(241, 241, 241)",
				}}
				elevation={3}
			>
				{/* <pre>{JSON.stringify(tasksForAdmin)}</pre> */}
				<Typography
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						fontSize: "3vh",
						color: "rgb(187, 41, 46)",
					}}
				>
					Tasks assigned to you
				</Typography>
				<hr />

				<Table
					sx={{
						"& thead th:first-child": {
							width: "55%",
						},
						"& thead th:last-child": {
							width: "45%",
						},
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
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
									{moment(task.time_created).format("MMMM DD YYYY, h:mm a")}
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
					sx={{
						margin: "0 auto",

						width: "90%",
						maxWidth: "750px",
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
								width: "90%",
								padding: "40px",
								backgroundColor: "rgb(241, 241, 241)",
							}}
							elevation={3}
						>
							<ClearIcon onClick={() => setOpen2(false)} />
							<Typography
								variant="h4"
								component="h2"
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									borderBottom: "1px solid grey",
									color: "rgb(187, 41, 46)",
								}}
							>
								Task Info
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Title: {infoOfSpecificTask.title}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Tags:
							</Typography>

							<ul>
								{specificTaskTags &&
									specificTaskTags.map((tag) => (
										<li key={tag.tag_id}>{tag.tag_name}</li>
									))}
							</ul>

							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Budget: ${infoOfSpecificTask.budget}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Location: {infoOfSpecificTask.location_name}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Due Date:{" "}
								{infoOfSpecificTask.due_date != null
									? moment(infoOfSpecificTask.due_date).format(
											"MMMM DD YYYY, h:mm a"
									  )
									: " "}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
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
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Button
									variant="contained"
									sx={{
										backgroundColor: "rgb(187, 41, 46)",

										width: "30%",
									}}
									onClick={() => {
										handleOpenChild();
									}}
								>
									Comments
								</Button>
								<Button
									variant="contained"
									sx={{
										backgroundColor: "rgb(187, 41, 46)",

										width: "30%",
									}}
									onClick={handleCompleteTask}
								>
									Complete
								</Button>
								<Button
									variant="contained"
									sx={{
										backgroundColor: "rgb(187, 41, 46)",

										width: "30%",
									}}
									onClick={handleDropTask}
								>
									Didn't Complete
								</Button>
							</Box>
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
									<Typography
										variant="h4"
										component="h2"
										sx={{ textDecoration: "underline" }}
									></Typography>
									<br />
									<TextField
										type="text"
										label="Add a comment..."
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
													sx={{ backgroundColor: "rgb(187, 41, 46)" }}
												>
													Send
												</Button>
											),
										}}
									/>
									<Box>
										<List>
											{commentsForTask.length > 0 &&
												commentsForTask.map((comment) => (
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
			<Paper
				sx={{
					p: 3,
					maxWidth: "750px",
					width: "90%",
					backgroundColor: "rgb(241, 241, 241)",
				}}
				elevation={3}
			>
				{/* <pre>{JSON.stringify(tasksForAdmin)}</pre> */}
				<Typography
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						fontSize: "3vh",
						color: "rgb(187, 41, 46)",
					}}
				>
					Previous Tasks
				</Typography>
				<hr />
				<Table
					sx={{
						"& thead th:first-child": {
							width: "55%",
						},
						"& thead th:last-child": {
							width: "45%",
						},
					}}
				>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Date Completed</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{userCompletedTasks.map((task) => (
							<TableRow
								key={task.id}
								onClick={() => {
									handleOpen3();
									dispatch({ type: "VIEW_TASK_INFO", payload: task });
								}}
							>
								<TableCell>{task.title}</TableCell>
								<TableCell>
									{moment(task.time_completed).format("MMMM DD YYYY, h:mm a")}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Modal
					open={open3}
					onClose={() => {
						handleClose3();
						dispatch({ type: "UNVIEW_TASK_INFO" });
					}}
					sx={{
						margin: "0 auto",

						width: "90%",
						maxWidth: "750px",
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
								width: "90%",
								padding: "40px",
								backgroundColor: "rgb(241, 241, 241)",
							}}
							elevation={3}
						>
							<ClearIcon onClick={() => setOpen3(false)} />

							<Typography
								variant="h4"
								component="h2"
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									borderBottom: "1px solid grey",
									color: "rgb(187, 41, 46)",
								}}
							>
								Task Info
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Title: {infoOfSpecificTask.title}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Tags:
							</Typography>

							<ul>
								{specificTaskTags &&
									specificTaskTags.map((tag) => (
										<li key={tag.tag_id}>{tag.tag_name}</li>
									))}
							</ul>

							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Budget: ${infoOfSpecificTask.budget}
							</Typography>
							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Date Completed:{" "}
								{infoOfSpecificTask.time_completed != null
									? moment(infoOfSpecificTask.time_completed).format(
											"MMMM DD YYYY, h:mm a"
									  )
									: " "}
							</Typography>
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
								Location: {infoOfSpecificTask.location_name}
							</Typography>

							<br />
							<Typography
								variant="h6"
								component="h4"
								sx={{ borderBottom: "1px solid grey" }}
							>
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
								sx={{ backgroundColor: "rgb(187, 41, 46)" }}
								onClick={() => {
									handleOpenChild();
								}}
							>
								Comments
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

									<br />
									<Box>
										<List>
											{commentsForTask.length > 0 &&
												commentsForTask.map((comment) => (
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
			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				action={action}
			>
				{snackbarMessage}
			</Snackbar>
		</Stack>
	);
}
