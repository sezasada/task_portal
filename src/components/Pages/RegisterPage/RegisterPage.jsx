import React from "react";

import { useHistory } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import {
  Paper,
  Button,
} from "@mui/material";
import { Stack } from "@mui/system";

function RegisterPage() {
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
        <RegisterForm />
        <center>
          <Button
            type="button"
            varient="contained"
            className="btn btn_asLink"
            onClick={() => {
              history.push("/login");
            }}
            sx={{
              color: "white",
              backgroundColor: "rgb(187, 41, 46)",
              "&:hover": {
                backgroundColor: "rgb(187, 41, 46)",
                transform: "scale(1.03)",
                color: "white",
              },
              width: 300,
            }}
          >
            Login
          </Button>
        </center>
      </Paper>
    </Stack>
  );
}

export default RegisterPage;
