import React from "react";

import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Stack } from "@mui/system";

import { Typography, Button, TextField, Box } from "@mui/material";

function ResetPassword() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState('');



  useEffect(() => {
    const url = new URL(window.location.href);
    let token = url.href.slice((url.href.indexOf("?") + 1));
    dispatch({type: "CHECK_IF_VALID", payload: {token: token, history: history}});
  }, []);

  const handleChange = (event) => {
    setNewPassword(event.target.value);
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const url = new URL(window.location.href);

    let newObject = {
      newPassword: newPassword,
      token: url.href.slice((url.href.indexOf("?") + 1))
    }
    dispatch({type: 'NEW_PASSWORD', payload: newObject})
    history.push("/login");

  }

  return (
    <>
        <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", "margin-top":"20px", }}
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
          Create New Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextField
              required
              type="text"
              label={"New Password"}
              value={newPassword}
              sx={{
                marginBottom: 1,
                display: "flex",
              }}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: "white",
                      color:"black",
                      ":hover": {
                        bgcolor: "#F58259",
                        color: "black"},
                    }}
                  >
                    Reset
                  </Button>
                ),
              }}
            />
          </Stack>
        </form>
      </Stack>
    </Box>
    </>



  );
}

export default ResetPassword;
