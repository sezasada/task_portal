import { useSelector } from "react-redux";
import { Stack } from "@mui/system";
import { Typography, Box } from "@mui/material";
import TasksAwaitingApproval from "./AdminDashboard/TasksAwaitingApproval";
import TasksAssignedToYou from "./AdminDashboard/TasksAssignedToYou";

export default function AdminDashboard() {
  // Access user reducer
  const user = useSelector((store) => store.user);
  return (
    <Stack
      spacing={3}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box>

        <TasksAwaitingApproval />
      </Box>
      <Box>
        <TasksAssignedToYou />
      </Box>
    </Stack>
  );
}
