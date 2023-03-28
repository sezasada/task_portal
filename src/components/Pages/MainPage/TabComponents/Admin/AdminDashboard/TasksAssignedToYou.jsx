import {
  Button,
  List,
  ListItem,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Card,
  Typography,
  ImageList,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import { Box, Stack } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import moment from "moment";

export default function TasksAssignedToYou() {
  const dispatch = useDispatch();

  const tasksForAdmin = useSelector((store) => store.allTasksForAdminReducer);
  const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
  const specificTaskTags = infoOfSpecificTask.tags;
  const photosForTask = infoOfSpecificTask.photos;
  const commentsForTask = useSelector((store) => store.commentsForTaskReducer);

  const [comment, setComment] = useState("");

  // Manage opening and closing of second details modal
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => {
    setOpen2(true);
  };
  const handleClose2 = () => setOpen2(false);

  // Manage opening and closing of child modal for comments modal
  const [openChild, setOpenChild] = useState(false);
  const handleOpenChild = () => {
    setOpenChild(true);
    dispatch({
      type: "FETCH_COMMENTS_FOR_TASK",
      payload: { task_id: infoOfSpecificTask.task_id },
    });
  };
  const handleCloseChild = () => setOpenChild(false);

  const handleCompleteTask = () => {
    console.log("infoOfSpecificTask:", infoOfSpecificTask);
    dispatch({ type: "COMPLETE_TASK", payload: infoOfSpecificTask });
    handleClose2();
  };

  const handleDropTask = () => {
    console.log("drop task clicked", infoOfSpecificTask);
    dispatch({ type: "DROP_TASK", payload: infoOfSpecificTask });
    handleClose2();
  };

  function handleSubmitComment() {
    const commentObj = {
      task_id: infoOfSpecificTask.task_id,
      content: comment,
    };

    dispatch({ type: "ADD_COMMENT_TO_TASK", payload: commentObj });
    dispatch({
      type: "FETCH_COMMENTS_FOR_TASK",
      payload: { task_id: infoOfSpecificTask.task_id },
    });
    setComment("");
  }

  return (
    <Paper
      sx={{
        p: 3,
        maxWidth: "750px",
        width: "90%",
        backgroundColor: "rgb(241, 241, 241)",
      }}
      F
      elevation={3}
    >
      {/* <pre>{JSON.stringify(tasksForAdmin)}</pre> */}
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "3vh",
          color: "rgb(187, 41, 46)",
        }}
      >
        Tasks assigned to you
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
              Title
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
              Created By
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
              Created At
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasksForAdmin.map((task) => (
            <TableRow
              key={task.id}
              onClick={() => {
                handleOpen2();
                dispatch({ type: "VIEW_TASK_INFO", payload: task });
              }}
            >
              <TableCell
                sx={{
                  width: "33%",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {task.title}
              </TableCell>
              <TableCell
                sx={{
                  width: "33%",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {task.created_by_first_name} {task.created_by_last_name}
              </TableCell>
              <TableCell
                sx={{
                  width: "33%",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {moment(task.time_created).format("MMMM DD YYYY, h:mm a")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={open2}
        onClose={() => {
          handleClose2();
          dispatch({ type: "UNVIEW_TASK_INFO" });
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
            <ClearIcon onClick={() => setOpen2(false)} />
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
              Task Info
            </Typography>
            <br />
            <Typography
              variant="h6"
              component="h4"
              sx={{ borderBottom: "1px solid grey" }}
            >
              Title: {infoOfSpecificTask.title}
            </Typography>
            <br />
            <Typography
              variant="h6"
              component="h4"
              sx={{ borderBottom: "1px solid grey" }}
            >
              Tags:
            </Typography>

            <ul>
              {specificTaskTags &&
                specificTaskTags.map((tag) => (
                  <li key={tag.tag_id}>{tag.tag_name}</li>
                ))}
            </ul>

            <Typography
              variant="h6"
              component="h4"
              sx={{ borderBottom: "1px solid grey" }}
            >
              Budget: ${infoOfSpecificTask.budget}
            </Typography>
            <br />
            <Typography
              variant="h6"
              component="h4"
              sx={{ borderBottom: "1px solid grey" }}
            >
              Location: {infoOfSpecificTask.location_name}
            </Typography>
            <br />
            <Typography
              variant="h6"
              component="h4"
              sx={{ borderBottom: "1px solid grey" }}
            >
              Due Date:{" "}
              {infoOfSpecificTask.due_date != null
                ? moment(infoOfSpecificTask.due_date).format(
                    "MMMM DD YYYY, h:mm a"
                  )
                : " "}
            </Typography>
            <br />
            <Typography
              variant="h6"
              component="h4"
              sx={{ borderBottom: "1px solid grey" }}
            >
              Created By: {infoOfSpecificTask.created_by_first_name}{" "}
              {infoOfSpecificTask.created_by_last_name}
            </Typography>
            <br />
            <Typography
              variant="h6"
              component="h4"
              sx={{ borderBottom: "1px solid grey" }}
            >
              Notes: {infoOfSpecificTask.notes}
            </Typography>

            <ImageList class="image_line">
              {photosForTask &&
                photosForTask.map((item) => {
                  return (
                    <img
                      src={item.photo_url}
                      style={{
                        width: "300px",
                        border: "1px solid black",
                        margin: "5px",
                        "border-radius": "3%",
                      }}
                    />
                  );
                })}
            </ImageList>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{
                  marginRight: "10%",
                  width: "30%",
                  maxWidth: "220px",
                  marginTop: "5px",
                  backgroundColor: "rgb(187, 41, 46)",
                  "&:hover": {
                    backgroundColor: "rgb(187, 41, 46)",
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => {
                  handleOpenChild();
                }}
              >
                Comments
              </Button>
              <Button
                variant="contained"
                onClick={handleCompleteTask}
                sx={{
                  width: "30%",
                  marginRight: "10%",

                  maxWidth: "220px",
                  marginTop: "5px",
                  backgroundColor: "rgb(187, 41, 46)",
                  "&:hover": {
                    backgroundColor: "rgb(187, 41, 46)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                Finish
              </Button>
              <Button
                variant="contained"
                onClick={handleDropTask}
                sx={{
                  width: "30%",
                  maxWidth: "220px",
                  marginTop: "5px",
                  backgroundColor: "rgb(187, 41, 46)",
                  "&:hover": {
                    backgroundColor: "rgb(187, 41, 46)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                Didn't Finish
              </Button>
            </Box>
          </Paper>
          <Modal
            open={openChild}
            onClose={() => {
              handleCloseChild();
            }}
            sx={{ overflow: "scroll" }}
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
                  padding: "20px",
                  "background-color": "rgb(241, 241, 241)",
                  width: "400px",
                }}
                elevation={3}
              >
                <ClearIcon onClick={() => setOpenChild(false)} />
                {/* <pre>{JSON.stringify(commentsForTask)}</pre> */}
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ textDecoration: "underline" }}
                ></Typography>
                <br />
                <TextField
                  type="text"
                  label="Add a comment..."
                  value={comment}
                  multiline
                  rows={2}
                  sx={{
                    "margin-left": "2px",
                    "margin-right": "2px",
                    "padding-left": "2px",
                    "padding-right": "2px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                    "& .MuiFormLabel-root.Mui-focused": {
                      color: "rgb(187, 41, 46)",
                    },
                  }}
                  onChange={(event) => setComment(event.target.value)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        onClick={handleSubmitComment}
                        sx={{
                          backgroundColor: "rgb(187, 41, 46)",
                          "&:hover": {
                            backgroundColor: "rgb(187, 41, 46)",
                            transform: "scale(1.03)",
                          },
                        }}
                      >
                        Send
                      </Button>
                    ),
                  }}
                />

                <Box>
                  <List>
                    {commentsForTask.length > 0 &&
                      commentsForTask.map((comment) => (
                        <Card
                          key={comment.comment_id}
                          sx={{
                            margin: "5px",
                            padding: "20px",
                            background: "white",
                          }}
                        >
                          <Box sx={{ fontWeight: "bold" }}>
                            {comment.posted_by_first_name}
                          </Box>
                          <Box sx={{ fontWeight: "light" }}>
                            {moment(comment.time_posted).format(
                              "MMMM DD, YYYY h:mma"
                            )}
                          </Box>
                          <br />
                          {comment.content}{" "}
                        </Card>
                      ))}
                  </List>
                </Box>
              </Paper>
            </Stack>
          </Modal>
        </Stack>
      </Modal>
    </Paper>
  );
}
