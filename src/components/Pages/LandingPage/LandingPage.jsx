import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./LandingPage.css";

// CUSTOM COMPONENTS
import RegisterForm from "../RegisterPage/RegisterForm";
import { Box, Button, Paper, Typography } from "@mui/material";

function LandingPage() {
	const history = useHistory();

	const onLogin = (event) => {
		history.push("/login");
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				flexWrap: "wrap",
				maxWidth: "100%",
			}}
		>
			<Paper
				sx={{
					p: 3,
					backgroundColor: "rgb(241, 241, 241)",
					maxWidth: "750px",
					minWidth: "275px",
				}}
				elevation={3}
			>
				<Typography
					component="h2"
					variant="h4"
					sx={{ textDecoration: "underline", textAlign: "center" }}
				>
					Welcome to the Task Portal!
				</Typography>
			</Paper>
			<br />
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					maxWidth: "750px",
					minWidth: "300px",
				}}
			>
				<Box
					sx={{
						width: "50%",
					}}
				>
					<Paper
						sx={{
							p: 3,
							backgroundColor: "rgb(241, 241, 241)",
						}}
						elevation={3}
					>
						<Typography variant="p" component="p">
							This application is designed to aid in task management for Farm in
							Dell of the Red River Valley. After registering an account here
							you must be approved to gain access to the rest of the
							application. If you need to inquire about getting your account
							approved, please contact the main office.
						</Typography>
					</Paper>
				</Box>
				<Box
					sx={{
						width: "40%",
					}}
				>
					<RegisterForm />
					<center>
						<Typography component="h4" variant="subtitle1" fontWeight="bold">
							Already a Member?
						</Typography>
						<Button
							className="btn btn_sizeSm"
							onClick={onLogin}
							variant="contained"
						>
							Login
						</Button>
					</center>
				</Box>
			</Box>
		</Box>
	);
}

export default LandingPage;
