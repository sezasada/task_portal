import React, { useState } from "react";
import LogOutButton from "../../Shared/LogOutButton/LogOutButton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { AppBar, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
function UserPage() {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.user);
	const unverifiedUsers = useSelector((store) => store.unverifiedUsersReducer);

	const [tabIndex, setTabIndex] = useState(0);

	const handleTabChange = (event, newTabIndex) => {
		setTabIndex(newTabIndex);
	};

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
						<pre>{JSON.stringify(user)}</pre>
						<pre>{JSON.stringify(unverifiedUsers)}</pre>
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
