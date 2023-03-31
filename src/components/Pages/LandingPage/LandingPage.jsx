import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./LandingPage.css";

// CUSTOM COMPONENTS
import RegisterForm from "../RegisterPage/RegisterForm";
import { Box, Button, Paper, Typography } from "@mui/material";

function LandingPage() {
  const history = useHistory();

  const onLogin = (event) => {
    history.push("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        flexWrap: "wrap",
        maxWidth: "100%",
        p: 3,
      }}
    >
      <Paper
        sx={{
          p: 3,
          backgroundColor: "rgb(241, 241, 241)",
          maxWidth: "750px",
          minWidth: "275px",
        }}
        elevation={3}
      >
        <Typography
          component="h2"
          variant="h4"
          sx={{ textDecoration: "underline", textAlign: "center", color:"rgb(187, 41, 46)" }}
        >
          Welcome to FarmWorks!
        </Typography>
      </Paper>
      <br />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "750px",
          minWidth: "300px",

		  
          flexDirection: "row",
          flexWrap: "wrap",
          '@media(max-width: 600px)': {
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{
            width: "348px",
			marginTop: "8px",
			marginRight: "10px",
          }}
        >
          <Paper
            sx={{
              p: 3,
              backgroundColor: "rgb(241, 241, 241)",
            }}
            elevation={3}
          >
            <Typography 
			sx={{
				textAlign:"center",

			}}>
        	This task management solution was designed
              exclusively for the Farm in the Dell of Red River Valley
              organization. Our website is specifically tailored to help staff
              and volunteers manage various tasks related to farming operations. With FarmWorks, you can easily organize your to-do lists, assign tasks to
              team members, and track progress in real-time. Sign up today to start using FarmWorks and
              streamline your farming operations at Farm in the Dell of Red
              River Valley.
            </Typography>
			<Typography
			sx={{
				borderTop: "3px dashed black",
				textAlign:"center",
				marginTop:'10px',
				paddingTop:'5px',
			}}>
              After registering an account here
              you must be approved by an admin to gain access to the rest of the
              application. 
            </Typography>
			<Typography
			sx={{
				
				textAlign:"center",
			}}>If you need to inquire about getting your account
              approved, please contact the main office.</Typography>
          </Paper>
        </Box>
        <Box
          sx={{
            width: "40%",
          }}
        >
          <RegisterForm />
          <center>
            <Typography component="h4" variant="subtitle1" fontWeight="bold">
              Already a Member?
            </Typography>
            <Button
              className="btn btn_sizeSm"
              onClick={onLogin}
			  sx={{
				textDecoration:"underline",
				color:"black",
				
			  }}
            >
              Login
            </Button>
          </center>
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;
