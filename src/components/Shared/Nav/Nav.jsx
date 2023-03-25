import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Nav.css";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import NotVerifiedUser from "../../Pages/MainPage/TabComponents/NotVerified/NotVerifiedUser";
function Nav() {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const tabIndex = useSelector((store) => store.tabIndexReducer);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  function handleOpenNavMenu(event) {
    setAnchorElNav(event.currentTarget);
  }
  function handleOpenUserMenu(event) {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseNavMenu() {
    setAnchorElNav(null);
  }

  function handleCloseUserMenu() {
    setAnchorElUser(null);
  }

  return (
    <AppBar
      
      position="sticky"
      sx={{
        width: "100vw",
        "background-color": "#BB292E",
        
      }}
    >
      <Container
      
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          
        }}
      >
        <Box >
          <Link
            to="/home"
            onClick={() => dispatch({ type: "UNSET_TAB_INDEX" })}
          >
            <Typography component="h2" variant="h5">
              Task Portal
            </Typography>
          </Link>
        </Box>
        <Box>
          <Tabs
            value={tabIndex}
            textColor="secondary"
            indicatorColor="secondary"
          >
            {user.is_admin && user.is_verified ? (
              <>
                <Tab
                  label="Dashboard"
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 0 });
                    history.push("/main");
                  }}
                />
                <Tab
                  label="Manage Users"
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 1 });
                    history.push("/main");
                  }}
                />
                <Tab
                  label="Manage Tasks"
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 2 });
                    history.push("/main");
                  }}
                />
              </>
            ) : user.is_verified ? (
              <>
                <Tab
                  label="Dashboard"
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 0 });
                    history.push("/main");
                  }}
                />
                <Tab
                  label="Create Task"
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 1 });
                    history.push("/main");
                  }}
                />
                <Tab
                  label="Task List"
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 2 });
                    history.push("/main");
                  }}
                />
              </>
            ) : (
              ""
            )}
          </Tabs>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {/* If no user is logged in, show these links */}
            {!user.id && (
              // If there's no user, show login/registration links
              <MenuItem onClick={() => history.push("/login")}>
                <Typography>Login / Register</Typography>
              </MenuItem>
            )}

            {/* If a user is logged in, show these links */}
            {user.id && (
              <>
                <MenuItem onClick={() => history.push("/main")}>
                  <Typography>Home</Typography>
                </MenuItem>

                <MenuItem onClick={() => dispatch({ type: "LOGOUT" })}>
                  <Typography>Logout</Typography>
                </MenuItem>

                <MenuItem onClick={() => history.push("/about")}>
                  <Typography>Profile</Typography>
                </MenuItem>
              </>
            )}
          </Menu>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton size="large" onClick={handleOpenNavMenu}>
              <AccountCircleIcon />
            </IconButton>
            {user.id && (
              <Typography>
                {user.first_name} {user.last_name}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}

export default Nav;
