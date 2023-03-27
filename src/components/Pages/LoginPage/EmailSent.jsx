import React from "react";
import { Stack } from "@mui/system";

import { Typography, Button, TextField, Box } from "@mui/material";

import { useHistory } from "react-router-dom";

function EmailSent() {
  const history = useHistory();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "margin-top": "20px",
      }}
    >
      <Stack
        sx={{
          backgroundColor: "rgb(241, 241, 241)",
          padding: "10px",
          borderRadius: "12px",
        }}
      >
        <Typography
          sx={{
            fontSize: 25,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "rgb(187, 41, 46)",
          }}
        >
          Check your email
        </Typography>
        <form>
          <Stack>
            <Typography
              sx={{
                fontSize: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "Black",
              }}
            >
              Email sent to your inbox to reset your password
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                history.push("/login");
              }}
              sx={{
                marginTop: "10px",
                background: "white",
                color:"black",
                ":hover": {
                  bgcolor: "#F58259",
                  color: "black"},
              }}
            >
              Back to Login
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
export default EmailSent;
