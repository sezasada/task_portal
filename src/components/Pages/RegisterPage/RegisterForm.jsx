import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MuiTelInput } from "mui-tel-input";
import {
  Snackbar,
  Alert,
  Paper,
  Card,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Button,
  Box,
  TextField,
  List,
  ImageList,
  ListItem,
  IconButton,
} from "@mui/material";
import { Stack } from "@mui/system";

function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: "REGISTER",
      payload: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        phone_number: phoneNumber,
      },
    });
  }; // end registerUser

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "8px",
        marginBottom: "10px",
      }}
      spacing={3}
    >
      <Paper
        sx={{
          p: 3,
          backgroundColor: "rgb(241, 241, 241)",
        }}
        elevation={3}
      >
        <form onSubmit={registerUser}>
		<Stack
		sx={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			
		  }}>
          <Typography
            component="h2"
            variant="h4"
            sx={{ 
				color: "rgb(187, 41, 46)",
				textDecoration: "underline" }}
          >
            Register
          </Typography>

          {errors.registrationMessage && (
            <>
              <br />
              <Typography
                component="h3"
                variant="h6"
                className="alert"
                role="alert"
              >
                {errors.registrationMessage}
              </Typography>
            </>
          )}
          <br />
          <Stack spacing={1}
		  sx={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			
		  }}>
            <Box>
              <TextField
                sx={{ width: "238px" }}
                type="text"
                name="first-name"
                label="Enter First Name"
                value={firstName}
                required
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Box>
            <Box>
              <TextField
                sx={{ width: "238px" }}
                type="text"
                name="last-name"
                value={lastName}
                label="Enter Last Name"
                required
                onChange={(event) => setLastName(event.target.value)}
              />
            </Box>
            <Box>
              <TextField
                sx={{ width: "238px" }}
                type="email"
                name="email"
                value={username}
                label="Enter Email Address"
                required
                onChange={(event) => setUsername(event.target.value)}
              />
            </Box>
            <Box>
              <TextField
                sx={{ width: "238px" }}
                type="password"
                name="password"
                value={password}
                label="Enter Password"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </Box>
            <Box>
              <MuiTelInput
                sx={{ width: "238px" }}
                value={phoneNumber}
                label="Enter Phone Number"
                required
                defaultCountry="US"
                flagSize="small"
                onChange={(newPhone) => {
                  setPhoneNumber(newPhone);
                }}
              />
            </Box>
            <Box>
              <Button 
			  type="submit" 
			  variant="contained"
			  sx={{
				color: "white",
				backgroundColor: "rgb(187, 41, 46)",
				"&:hover": {
				  backgroundColor: "rgb(187, 41, 46)",
				  transform: "scale(1.03)",
				},
				width: 242,
			  }}>
                Register
              </Button>
            </Box>
          </Stack>
		  </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export default RegisterForm;
