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
			  sx={{
				textDecoration:"underline",
				color:"black",
				
			  }}
              onClick={() => {
                history.push("/registration");
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
