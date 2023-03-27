import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Stack } from "@mui/system";

import {
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
function RequestReset() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    console.log("in handle submit");
    event.preventDefault();

    let newObject = {
      email: email,
      history: history,
    };
    dispatch({ type: "RESET_PASSWORD", payload: newObject });
    //history.push('/email_sent');
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
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
          Need a password reset?
        </Typography>
        <form onSubmit={handleSubmit}>
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
              Enter your email below to request reset.
            </Typography>

            <TextField
              required
              type="email"
              label={"Email"}
              value={email}
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
                    Send
                  </Button>
                ),
              }}
            />
            
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
export default RequestReset;
