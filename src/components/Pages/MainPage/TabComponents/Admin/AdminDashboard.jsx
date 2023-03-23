import { useSelector } from "react-redux";
import { Stack } from "@mui/system";
import { Typography, Box } from "@mui/material";
import TasksAwaitingApproval from "./AdminDashboard/TasksAwaitingApproval";
import TasksAssignedToYou from "./AdminDashboard/TasksAssignedToYou";

export default function AdminDashboard() {
	// Access user reducer
	const user = useSelector((store) => store.user);
	return (
		<Stack spacing={3}>
			<Box>
				<Typography component="h2" variant="h4">
					Welcome, {user.first_name}!
				</Typography>
				<TasksAwaitingApproval />
			</Box>
			<Box>
				<TasksAssignedToYou />
			</Box>
		</Stack>
	);
}
