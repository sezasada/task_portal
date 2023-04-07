import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Snackbar,
	Alert,
	Paper,
	Typography,
	Button,
	Box,
	TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
function Profile() {
	const user = useSelector((store) => store.user);
	const [firstName, setFirstName] = useState(user.first_name);
	const [lastName, setLastName] = useState(user.last_name);
	const [username, setUsername] = useState(user.username);
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [sendEmail, setSendEmail] = useState(user.send_emails);
	console.log(sendEmail);

	const dispatch = useDispatch();

	useEffect(() => {
		setFirstName(user.first_name);
		setLastName(user.last_name);
		setUsername(user.username);
		setPhoneNumber(user.phone_number);
	}, [user]);

	const updateUser = (event) => {
		event.preventDefault();

		dispatch({
			type: "UPDATE_USER",
			payload: {
				first_name: firstName,
				last_name: lastName,
				username: username,
				phone_number: phoneNumber,
			},
		});
		dispatch({
			type: "SET_SNACKBAR_MESSAGE",
			payload: <Alert severity="success">Profile Information Updated</Alert>,
		});
		handleOpenSnackbar();
	};

	const resetPassword = (event) => {
		event.preventDefault();

		dispatch({
			type: "RESET_PASSWORD_DIRECT",
			payload: {
				password: newPassword,
				username: user.username,
			},
		});
		dispatch({
			type: "SET_SNACKBAR_MESSAGE",
			payload: <Alert severity="success">Password Reset Successfully</Alert>,
		});
		handleOpenSnackbar();
		setNewPassword("");
		setConfirmPassword("");
	};

	const updateEmailPref = () => {
		console.log("in updateemailpref");
		dispatch({ type: "UPDATE_EMAIL_PREF" });
		dispatch({
			type: "SET_SNACKBAR_MESSAGE",
			payload: <Alert severity="success">Email Preferences Updated</Alert>,
		});
		handleOpenSnackbar();
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
				marginTop: "4vh",
			}}
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
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							fontSize: "2.3vh",
							color: "rgb(187, 41, 46)",
							borderBottom: "1px solid grey",
						}}
					>
						Update Profile
					</Typography>
					<br />
					<form
						onSubmit={updateUser}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Stack>
							<TextField
								type="text"
								label="first name"
								value={firstName}
								onChange={(event) => setFirstName(event.target.value)}
							/>
							<br />
							<TextField
								type="text"
								label="last name"
								value={lastName}
								onChange={(event) => setLastName(event.target.value)}
							/>
							<br />
							<TextField
								type="text"
								label="email"
								value={username}
								onChange={(event) => setUsername(event.target.value)}
							/>
							<br />
							<TextField
								type="text"
								label="phone number"
								value={phoneNumber}
								onChange={(event) => setPhoneNumber(event.target.value)}
							/>
							<br />

							<Button
								varient="contained"
								type="submit"
								sx={{
									color: "white",
									backgroundColor: "rgb(187, 41, 46)",
									"&:hover": {
										backgroundColor: "rgb(187, 41, 46)",
										transform: "scale(1.03)",
									},
									width: 300,
								}}
							>
								Update Profile
							</Button>
						</Stack>
					</form>
				</Stack>
			</Paper>
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
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							fontSize: "2.3vh",
							color: "rgb(187, 41, 46)",
							borderBottom: "1px solid grey",
						}}
					>
						Change Password
					</Typography>
					<br />
					<form
						onSubmit={resetPassword}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Stack>
							<TextField
								required
								type="password"
								label="new password"
								value={newPassword}
								onChange={(event) => setNewPassword(event.target.value)}
							/>
							<br />
							<TextField
								required
								type="password"
								label="confirm password"
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
							/>
							<br />
							<Button
								varient="contained"
								type="submit"
								sx={{
									color: "white",
									backgroundColor: "rgb(187, 41, 46)",
									"&:hover": {
										backgroundColor: "rgb(187, 41, 46)",
										transform: "scale(1.03)",
									},
									width: 300,
								}}
							>
								Change Password
							</Button>
						</Stack>
					</form>
				</Stack>
			</Paper>
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
					<form>
						<Typography
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								fontSize: "2.3vh",
								color: "rgb(187, 41, 46)",
								borderBottom: "1px solid grey",
							}}
						>
							Update Email Preferences
						</Typography>
						<br />
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{sendEmail ? (
								<Button
									onClick={() => updateEmailPref()}
									varient="contained"
									type="submit"
									sx={{
										color: "white",
										backgroundColor: "rgb(187, 41, 46)",
										"&:hover": {
											backgroundColor: "rgb(187, 41, 46)",
											transform: "scale(1.03)",
										},
										width: 300,
									}}
								>
									{" "}
									Turn off email notifications
								</Button>
							) : (
								<Button
									onClick={() => updateEmailPref()}
									varient="contained"
									type="submit"
									sx={{
										color: "white",
										backgroundColor: "rgb(187, 41, 46)",
										"&:hover": {
											backgroundColor: "rgb(187, 41, 46)",
											transform: "scale(1.03)",
										},
										width: 300,
									}}
								>
									Turn on email notifications
								</Button>
							)}
						</Box>
					</form>
					<Snackbar
						open={openSnackbar}
						autoHideDuration={3000}
						onClose={handleCloseSnackbar}
					>
						{snackbarMessage}
					</Snackbar>
				</Stack>
			</Paper>
		</Stack>
	);
}

export default Profile;
