import React, { useState } from "react";
import LogOutButton from "../../Shared/LogOutButton/LogOutButton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
	AppBar,
	Button,
	Modal,
	Paper,
	Stack,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tabs,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
function UserPage() {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.user);
	const unverifiedUsers = useSelector((store) => store.unverifiedUsersReducer);
	const infoOfSpecificUser = useSelector(
		(store) => store.viewAccountInfoReducer
	);

	// Manage change in tabs
	const [tabIndex, setTabIndex] = useState(0);
	const handleTabChange = (event, newTabIndex) => {
		setTabIndex(newTabIndex);
	};

	// Manage opening and closing of details modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	useEffect(() => {
		dispatch({ type: "FETCH_UNVERIFIED_USERS" });
	}, []);

	return (
		<div className="container">
			<Box>
				<Tabs value={tabIndex} onChange={handleTabChange}>
					<Tab label="Dashboard" />
					<Tab label="Manage Users" />
					<Tab label="Manage Tasks" />
				</Tabs>
			</Box>
			<Box>
				{tabIndex === 0 && (
					<Box>
						<h2>Welcome, {user.first_name}!</h2>
						<p>Your ID is: {user.id}</p>
						<Paper sx={{ p: 3 }}>
							{/* <pre>{JSON.stringify(unverifiedUsers)}</pre> */}
							<Typography>Users awaiting approval</Typography>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Email</TableCell>
										<TableCell>Phone Number</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{unverifiedUsers.map((user) => (
										<TableRow
											key={user.id}
											onClick={() => {
												handleOpen();
												dispatch({ type: "VIEW_ACCOUNT_INFO", payload: user });
											}}
										>
											<TableCell>
												{user.first_name} {user.last_name}
											</TableCell>
											<TableCell>{user.username}</TableCell>
											<TableCell>{user.phone_number}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<Modal
								open={open}
								onClose={() => {
									handleClose();
									dispatch({ type: "UNVIEW_ACCOUNT_INFO" });
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
											User Info
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Name: {infoOfSpecificUser.first_name}{" "}
											{infoOfSpecificUser.last_name}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Email: {infoOfSpecificUser.username}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Phone Number: {infoOfSpecificUser.phone_number}
										</Typography>
										<br />
										<Typography variant="h6" component="h4">
											Created at:
										</Typography>
										<Button variant="contained">Approve</Button>
										<Button variant="contained">Deny</Button>
									</Paper>
								</Stack>
							</Modal>
						</Paper>
					</Box>
				)}
				{tabIndex === 1 && <Box></Box>}
				{tabIndex === 2 && <Box></Box>}
			</Box>

			<LogOutButton className="btn" />
		</div>
	);
}

// this allows us to use <App /> in index.js
export default UserPage;
