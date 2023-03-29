import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function LoginForm() {
	const history = useHistory();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const errors = useSelector((store) => store.errors);
	const dispatch = useDispatch();

	const login = (event) => {
		event.preventDefault();

		if (username && password) {
			dispatch({
				type: "LOGIN",
				payload: {
					username: username,
					password: password,
				},
			});
		} else {
			dispatch({ type: "LOGIN_INPUT_ERROR" });
		}
	}; // end login

	return (
		<Paper
			sx={{ p: 3, backgroundColor: "rgb(241, 241, 241)", maxWidth: "750px" }}
			elevation={3}
		>
			<form onSubmit={login}>
				<Typography
					component="h2"
					variant="h4"
					sx={{ textDecoration: "underline" }}
				>
					Login
				</Typography>
				{errors.loginMessage && (
					<Typography
						variant="h6"
						component="h3"
						className="alert"
						role="alert"
					>
						{errors.loginMessage}
					</Typography>
				)}
				<br />
				<Box>
					<TextField
						type="email"
						name="username"
						label="Email"
						required
						value={username}
						onChange={(event) => setUsername(event.target.value)}
					/>
				</Box>
				<br />
				<Box>
					<TextField
						type="password"
						name="password"
						label="Password"
						required
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</Box>
				<br />
				<Box>
					<Button
						variant="contained"
						type="submit"
						name="submit"
						value="Log In"
					>
						Log In
					</Button>
				</Box>
				<br />
				<Button
					variant="contained"
					type="button"
					className="btn btn_sizeSm"
					onClick={() => {
						history.push("/request_reset");
					}}
				>
					Reset Password
				</Button>
			</form>
		</Paper>
	);
}

export default LoginForm;
