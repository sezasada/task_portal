import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Box } from "@mui/system";
import AdminDashboard from "./TabComponents/Admin/AdminDashboard";
import AdminManageUsers from "./TabComponents/Admin/AdminManageUsers";
import AdminManageTasks from "./TabComponents/Admin/AdminManageTasks";
import UserDashboard from "./TabComponents/User/UserDashboard";
import UserCreateTask from "./TabComponents/User/UserCreateTask";
import UserTaskList from "./TabComponents/User/UserTaskList";
import NotVerifiedUser from "./TabComponents/NotVerified/NotVerifiedUser";
import AdminCreateTask from "./TabComponents/Admin/AdminCreateTask";
function UserPage() {
	const dispatch = useDispatch();

	// Access tab index reducer
	const tabIndex = useSelector((store) => store.tabIndexReducer);

	const user = useSelector((store) => store.user);
	// Grab all needed data on page load
	useEffect(() => {
		dispatch({ type: "FETCH_UNVERIFIED_USERS" });
		dispatch({ type: "FETCH_INCOMING_TASKS" });
		dispatch({ type: "FETCH_ALL_TASKS" });
		dispatch({ type: "FETCH_ALL_TAGS" });
		dispatch({ type: "FETCH_ALL_LOCATIONS" });
		dispatch({ type: "FETCH_VERIFIED_USERS" });
		dispatch({ type: "FETCH_ALL_TASKS_FOR_ADMIN" });
		dispatch({ type: "FETCH_ALL_COMPLETED_TASKS" });
		dispatch({ type: "FETCH_COMPLETED_USER_TASKS" });
		dispatch({ type: "FETCH_INCOMING_TASKS_FOR_USER" });

	}, []);

	return (
		<div className="container">
			<Box>
				{user.is_admin && user.is_verified ? (
					<>
						{tabIndex === 0 && <AdminDashboard />}
						{tabIndex === 1 && <AdminManageUsers />}
						{tabIndex === 2 && <AdminManageTasks />}
						{tabIndex === 3 && <AdminCreateTask />}
					</>
				) : user.is_verified ? (
					<>
						{tabIndex === 0 && <UserDashboard />}
						{tabIndex === 1 && <UserCreateTask />}
						{tabIndex === 2 && <UserTaskList />}
					</>
				) : (
					<NotVerifiedUser />
				)}
			</Box>
		</div>
	);
}

export default UserPage;
