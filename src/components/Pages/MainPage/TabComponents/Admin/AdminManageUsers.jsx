import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Button,
  Box,
} from "@mui/material";

import moment from "moment";

export default function AdminManageUsers() {
  const dispatch = useDispatch();

  // Access redux stores for users
  const unverifiedUsers = useSelector((store) => store.unverifiedUsersReducer);
  const verifiedUsers = useSelector((store) => store.verifiedUsersReducer);

  const infoOfSpecificUser = useSelector(
    (store) => store.viewAccountInfoReducer
  );

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleOpen2 = () => {
    setOpen2(true);
  };
  const handleClose = () => setOpen(false);

  const handleClose2 = () => setOpen2(false);

  const handleApprove = () => {
    console.log("Approve button clicked");
    dispatch({ type: "APPROVE_USER_REQUEST", payload: infoOfSpecificUser });

    handleClose();
  };

  const handleDeny = () => {
    console.log("Deny button clicked");
    dispatch({ type: "DENY_USER_REQUEST", payload: infoOfSpecificUser });
    handleClose();
  };

  const handlePromote = () => {
    console.log("Promote button clicked");
    dispatch({ type: "PROMOTE_USER", payload: infoOfSpecificUser });
    handleClose();
  };

  const handleDemote = () => {
    console.log("Demote button clicked");
    dispatch({ type: "DEMOTE_USER", payload: infoOfSpecificUser });
    handleClose();
  };

  console.log(infoOfSpecificUser);
  return (
    <Stack
      spacing={3}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Paper
        sx={{
          p: 3,
          maxWidth: "750px",
          width: "90%",
          backgroundColor: "rgb(241, 241, 241)",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3vh",
            color: "rgb(187, 41, 46)",
          }}
        >
          Users awaiting approval
        </Typography>
        <hr />
        <Table
          sx={{
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: "33%",
                  fontSize: "2vh",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  fontWeight: "bold",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  width: "33%",
                  fontSize: "2vh",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  fontWeight: "bold",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  width: "33%",
                  fontSize: "2vh",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  fontWeight: "bold",
                }}
              >
                Phone Number
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unverifiedUsers.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => {
                  handleOpen();
                  dispatch({ type: "VIEW_ACCOUNT_INFO", payload: user });
                }}
              >
                <TableCell
                  sx={{
                    width: "33%",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell
                  sx={{
                    width: "33%",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {user.username}
                </TableCell>
                <TableCell
                  sx={{
                    width: "33%",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {user.phone_number}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal
          open={open}
          onClose={() => {
            handleClose();
            dispatch({ type: "UNVIEW_ACCOUNT_INFO" });
          }}
          sx={{
            margin: "0 auto",
            width: "90%",
            maxWidth: "750px",
            overflow: "scroll",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                padding: "40px",
                backgroundColor: "rgb(241, 241, 241)",
              }}
              elevation={3}
            >
              {/* <pre>{JSON.stringify(infoOfSpecificUser)}</pre> */}
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "rgb(187, 41, 46)",
                  borderBottom: "1px solid grey",
                }}
              >
                User Info
              </Typography>
              <br />
              <Typography
                variant="h6"
                component="h4"
                sx={{ borderBottom: "1px solid grey" }}
              >
                Name: {infoOfSpecificUser.first_name}{" "}
                {infoOfSpecificUser.last_name}
              </Typography>
              <br />
              <Typography
                variant="h6"
                component="h4"
                sx={{ borderBottom: "1px solid grey" }}
              >
                Email: {infoOfSpecificUser.username}
              </Typography>
              <br />
              <Typography
                variant="h6"
                component="h4"
                sx={{ borderBottom: "1px solid grey" }}
              >
                Phone Number: {infoOfSpecificUser.phone_number}
              </Typography>
              <br />
              <Typography
                variant="h6"
                component="h4"
                sx={{ borderBottom: "1px solid grey" }}
              >
                Created at:{" "}
                {moment(infoOfSpecificUser.created_at).format("MMMM Do YYYY")}
              </Typography>
              {infoOfSpecificUser.is_verified ? (
                <>
                  <Button
                    variant="contained"
                    onClick={
                      infoOfSpecificUser.is_admin ? handleDemote : handlePromote
                    }
                  >
                    {infoOfSpecificUser.is_admin ? "Demote" : "Promote"}
                  </Button>
                </>
              ) : (
                <>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      onClick={handleApprove}
                      sx={{
                        marginRight: "10%",
                        width: "40%",
                        maxWidth: "220px",
                        marginTop: "10px",
                        backgroundColor: "rgb(187, 41, 46)",
                        "&:hover": {
                          backgroundColor: "rgb(187, 41, 46)",
                        },
                      }}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handleDeny}
                      sx={{
                        width: "40%",
                        maxWidth: "220px",
                        marginTop: "10px",
                        backgroundColor: "rgb(187, 41, 46)",
                        "&:hover": {
                          backgroundColor: "rgb(187, 41, 46)",
                        },
                      }}
                    >
                      Deny
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Stack>
        </Modal>
      </Paper>
      <Paper
        sx={{
          p: 3,
          maxWidth: "750px",
          width: "90%",
          backgroundColor: "rgb(241, 241, 241)",
        }}
        elevation={3}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3vh",
            color: "rgb(187, 41, 46)",
          }}
        >
          All Users
        </Typography>
        <Table
          sx={{
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: "33%",
                  fontSize: "2vh",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  fontWeight: "bold",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  width: "33%",
                  fontSize: "2vh",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  fontWeight: "bold",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  width: "33%",
                  fontSize: "2vh",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  fontWeight: "bold",
                }}
              >
                Admin Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {verifiedUsers.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => {
                  handleOpen2();
                  dispatch({ type: "VIEW_ACCOUNT_INFO", payload: user });
                }}
              >
                <TableCell
                  sx={{
                    width: "33%",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell
                  sx={{
                    width: "33%",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {user.username}
                </TableCell>
                <TableCell
                  sx={{
                    width: "33%",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {user.is_admin ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal
          open={open2}
          onClose={() => {
            handleClose2();
            dispatch({ type: "UNVIEW_ACCOUNTS_INFO" });
          }}
          sx={{
            margin: "0 auto",

            width: "90%",
            maxWidth: "750px",
            overflow: "scroll",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                padding: "40px",
                backgroundColor: "rgb(241, 241, 241)",
              }}
              elevation={3}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "rgb(187, 41, 46)",
                  borderBottom: "1px solid grey",
                }}
              >
                User Info
              </Typography>
              <br />
              <Typography
                variant="h6"
                component="h4"
                sx={{ borderBottom: "1px solid grey" }}
              >
                Name: {infoOfSpecificUser.first_name}{" "}
                {infoOfSpecificUser.last_name}
              </Typography>
              <br />
              <Typography
                variant="h6"
                component="h4"
                sx={{ borderBottom: "1px solid grey" }}
              >
                Email: {infoOfSpecificUser.username}
              </Typography>
              <br />
              <Typography
                variant="h6"
                component="h4"
                sx={{ borderBottom: "1px solid grey" }}
              >
                Phone Number: {infoOfSpecificUser.phone_number}
              </Typography>
              <br />
              <Typography
                variant="h6"
                component="h4"
                sx={{ borderBottom: "1px solid grey" }}
              >
                Created at:{" "}
                {moment(infoOfSpecificUser.created_at).format("MMMM Do YYYY")}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {infoOfSpecificUser.is_verified ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={
                        infoOfSpecificUser.is_admin
                          ? handleDemote
                          : handlePromote
                      }
                      sx={{
                        marginRight: "10%",
                        width: "40%",
                        maxWidth: "220px",
                        marginTop: "10px",
                        backgroundColor: "rgb(187, 41, 46)",
                        "&:hover": {
                          backgroundColor: "rgb(187, 41, 46)",
                        },
                      }}
                    >
                      {infoOfSpecificUser.is_admin ? "Demote" : "Promote"}
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handleDeny}
                      sx={{
                        width: "40%",
                        maxWidth: "220px",
                        marginTop: "10px",
                        backgroundColor: "rgb(187, 41, 46)",
                        "&:hover": {
                          backgroundColor: "rgb(187, 41, 46)",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={handleApprove}>
                      Approve
                    </Button>
                    <Button variant="contained" onClick={handleDeny}>
                      Deny
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Stack>
        </Modal>
      </Paper>
    </Stack>
  );
}
