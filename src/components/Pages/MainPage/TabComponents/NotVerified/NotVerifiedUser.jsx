import { Typography, Box, Paper } from "@mui/material";
import { Stack } from "@mui/system";

import "./NotVerifiedUser.css";
function NotVerifiedUser() {
  return (
    <Stack
      spacing={3}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Paper
        sx={{
          p: 3,
          maxWidth: "750px",
          marginTop: "10%",
          width: "90%",
          backgroundColor: "rgb(241, 241, 241)",
        }}
        elevation={3}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20%",
            marginBottom: "20%",
          }}
        >
          <Typography>
            <span className="text-animation">Account successfully created</span>
            <span className="text-animation">Waiting to be verified</span>
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
}

export default NotVerifiedUser;
