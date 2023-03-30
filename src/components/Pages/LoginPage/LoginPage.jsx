import React from "react";
import LoginForm from "./LoginForm";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import { Paper, Button } from "@mui/material";
import { Stack } from "@mui/system";

function LoginPage() {
  const history = useHistory();

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "4vh",
      }}
      spacing={3}
    >
      <Paper
        sx={{
          p: 3,
          maxWidth: "35vh",
          width: "90%",
          backgroundColor: "rgb(241, 241, 241)",
        }}
        elevation={3}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
          }}
        >
          <LoginForm />
          <br />
          <center>
            <Button
              type="button"
              varient="contained"
            className="btn btn_asLink"
              onClick={() => {
                history.push("/registration");
              }}
			  sx={{
				color: "white",
				backgroundColor: "rgb(187, 41, 46)",
				"&:hover": {
				  backgroundColor: "rgb(187, 41, 46)",
				  transform: "scale(1.03)",
				  color: "white",
				},
				width: 200,
			  }}
            >
              Register
            </Button>
          </center>
        </Box>
      </Paper>
    </Stack>
  );
}

export default LoginPage;
