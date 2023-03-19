import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Box } from "@mui/system";
import AdminDashboard from "./TabComponents/Admin/AdminDashboard";
import AdminManageUsers from "./TabComponents/Admin/AdminManageUsers";
import AdminManageTasks from "./TabComponents/Admin/AdminManageTasks";

function UserPage() {
	const dispatch = useDispatch();

	// Access tab index reducer
	const tabIndex = useSelector((store) => store.tabIndexReducer);

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
				{tabIndex === 0 && <AdminDashboard />}
				{tabIndex === 1 && <AdminManageUsers />}
				{tabIndex === 2 && <AdminManageTasks />}
			</Box>
		</div>
	);
}

export default UserPage;
