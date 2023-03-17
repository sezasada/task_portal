import React, { useState } from "react";
import LogOutButton from "../../Shared/LogOutButton/LogOutButton";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import AdminDashboard from "./TabComponents/Admin/AdminDashboard";
import AdminManageUsers from "./TabComponents/Admin/AdminManageUsers";
import AdminManageTasks from "./TabComponents/Admin/AdminManageTasks";

function UserPage() {
	const dispatch = useDispatch();

	// Manage change in tabs
	const [tabIndex, setTabIndex] = useState(0);
	const handleTabChange = (event, newTabIndex) => {
		setTabIndex(newTabIndex);
	};

	// Grab all needed data on page load
	useEffect(() => {
		dispatch({ type: "FETCH_UNVERIFIED_USERS" });
		dispatch({ type: "FETCH_INCOMING_TASKS" });
		dispatch({ type: "FETCH_ALL_TASKS" });
		dispatch({ type: "FETCH_ALL_TAGS" });
		dispatch({ type: "FETCH_ALL_LOCATIONS" });
		dispatch({ type: "FETCH_VERIFIED_USERS" });
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
				{tabIndex === 0 && <AdminDashboard />}
				{tabIndex === 1 && <AdminManageUsers />}
				{tabIndex === 2 && <AdminManageTasks />}
			</Box>
			<LogOutButton className="btn" />
		</div>
	);
}

export default UserPage;
