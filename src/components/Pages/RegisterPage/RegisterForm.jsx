import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MuiTelInput } from "mui-tel-input";

function RegisterForm() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const errors = useSelector((store) => store.errors);
	const dispatch = useDispatch();

	const registerUser = (event) => {
		event.preventDefault();

		dispatch({
			type: "REGISTER",
			payload: {
				first_name: firstName,
				last_name: lastName,
				username: username,
				password: password,
				phone_number: phoneNumber,
			},
		});
	}; // end registerUser

	return (
		<Paper
			sx={{
				p: 3,
				backgroundColor: "rgb(241, 241, 241)",
			}}
			elevation={3}
		>
			<form onSubmit={registerUser}>
				<Typography
					component="h2"
					variant="h4"
					sx={{ textDecoration: "underline" }}
				>
					Register
				</Typography>

				{errors.registrationMessage && (
					<>
						<br />
						<Typography
							component="h3"
							variant="h6"
							className="alert"
							role="alert"
						>
							{errors.registrationMessage}
						</Typography>
					</>
				)}
				<br />
				<Stack spacing={1}>
					<Box>
						<TextField
							sx={{ width: "238px" }}
							type="text"
							name="first-name"
							label="Enter First Name"
							value={firstName}
							required
							onChange={(event) => setFirstName(event.target.value)}
						/>
					</Box>
					<Box>
						<TextField
							sx={{ width: "238px" }}
							type="text"
							name="last-name"
							value={lastName}
							label="Enter Last Name"
							required
							onChange={(event) => setLastName(event.target.value)}
						/>
					</Box>
					<Box>
						<TextField
							sx={{ width: "238px" }}
							type="email"
							name="email"
							value={username}
							label="Enter Email Address"
							required
							onChange={(event) => setUsername(event.target.value)}
						/>
					</Box>
					<Box>
						<TextField
							sx={{ width: "238px" }}
							type="password"
							name="password"
							value={password}
							label="Enter Password"
							required
							onChange={(event) => setPassword(event.target.value)}
						/>
					</Box>
					<Box>
						<MuiTelInput
							sx={{ width: "238px" }}
							value={phoneNumber}
							label="Enter Phone Number"
							required
							defaultCountry="US"
							flagSize="small"
							onChange={(newPhone) => {
								setPhoneNumber(newPhone);
							}}
						/>
					</Box>
					<Box>
						<Button type="submit" variant="contained">
							Register
						</Button>
					</Box>
				</Stack>
			</form>
		</Paper>
	);
}

export default RegisterForm;
