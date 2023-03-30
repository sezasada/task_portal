import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";
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
  List,
  TextField,
  ImageList,
  Autocomplete,
  Box,
  Card,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";

export default function UserTaskList() {
  const dispatch = useDispatch();

  // Access redux stores for tasks
  const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
  const allApprovedTasks = useSelector((store) => store.allTasksReducer);
  const allAvailableTasks = useSelector(
    (store) => store.allAvailableTasksReducer
  );
  const sortedTasks = useSelector((store) => store.sortingTasksReducer);

  // Access redux store for all tags
  const allTags = useSelector((store) => store.allTagsReducer);
  const specificTaskTags = infoOfSpecificTask.tags;

  // Access redux store for all locations
  const allLocations = useSelector((store) => store.allLocationsReducer);

  // Access redux store for all users
  const verifiedUsers = useSelector((store) => store.verifiedUsersReducer);

  const allCompletedTasks = useSelector(
    (store) => store.allCompletedTasksReducer
  );
  const commentsForSpecificTask = useSelector(
    (store) => store.commentsForTaskReducer
  );
  const photosForTask = infoOfSpecificTask.photos;

  // Manage opening and closing of details modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Manage opening and closing of second details modal
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => {
    setOpen2(true);
  };
  const handleClose2 = () => setOpen2(false);

  const handleTakeTask = () => {
    console.log("take task button is clicked", infoOfSpecificTask);
    dispatch({ type: "TAKE_TASK", payload: infoOfSpecificTask });
    handleClose();
    dispatch({
      type: "SET_SNACKBAR_MESSAGE",
      payload: <Alert severity="success">Task Added to Your List</Alert>,
    });
    handleOpenSnackbar();
  };

  const handleDropTask = () => {
    console.log("drop task clicked", infoOfSpecificTask);
    dispatch({ type: "DROP_TASK", payload: infoOfSpecificTask });
    handleClose();
  };

  // Manage opening and closing of child modal for comments modal
  const [openChild, setOpenChild] = useState(false);
  const [comment, setComment] = useState("");
  const handleOpenChild = () => {
    setOpenChild(true);
    dispatch({
      type: "FETCH_COMMENTS_FOR_TASK",
      payload: { task_id: infoOfSpecificTask.task_id },
    });
    console.log("comments", commentsForSpecificTask);
  };
  const handleCloseChild = () => setOpenChild(false);

  function handleSubmitComment() {
    const commentObj = {
      task_id: infoOfSpecificTask.task_id,
      content: comment,
    };
    console.log(commentObj);
    dispatch({ type: "ADD_COMMENT_TO_TASK", payload: commentObj });
    dispatch({
      type: "FETCH_COMMENTS_FOR_TASK",
      payload: { task_id: infoOfSpecificTask.task_id },
    });
    setComment("");
  }

  // ------------- TABLE SORTING --------------- //

  // Manage state for sorting options
  const [sortMode, setSortMode] = useState(false);
  const [sortByLocation, setSortByLocation] = useState("");
  const [sortByTags, setSortByTags] = useState("");

  const activateSortMode = () => {
    setSortMode(true);
  };

  const deactivateSortMode = () => {
    setSortMode(false);
  };

  const handleSort = (type, payload) => {
    console.log("this is the type:", type, "this is the payload:", payload);
    dispatch({ type: type, payload: payload });
  };

  function handleSubmitSort(event, type) {
    if (event.target.value.id === undefined) {
      deactivateSortMode();
      if (type === "FETCH_BY_LOCATION_FOR_USER") {
        setSortByLocation(event.target.value);
      } else if (type === "FETCH_BY_TAGS_FOR_USER") {
        setSortByTags(event.target.value);
      }
      return;
    }

    activateSortMode();
    if (type === "FETCH_BY_LOCATION_FOR_USER") {
      setSortByLocation(event.target.value);
    } else if (type === "FETCH_BY_TAGS_FOR_USER") {
      setSortByTags(event.target.value);
    }

    handleSort(type, event.target.value.id);
  }

  // -------------- Snackbar Stuff -------------- //
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const snackbarMessage = useSelector((store) => store.snackbarMessageReducer);

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Stack
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        spacing={3}
      >
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
            Available Tasks
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
                    fontWeight: "bold",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{
                    width: "33%",
                    fontSize: "2vh",
                    fontWeight: "bold",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  Tags
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortMode
                ? sortedTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      onClick={() => {
                        handleOpen();
                        dispatch({ type: "VIEW_TASK_INFO", payload: task });
                        console.log(task);
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
                        {task.location_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "33%",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        <ul>
                          {task.tags &&
                            task.tags.map((tag) => (
                              <li key={tag.tag_id}> {tag.tag_name} </li>
                            ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))
                : allAvailableTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      onClick={() => {
                        handleOpen();
                        dispatch({ type: "VIEW_TASK_INFO", payload: task });
                        console.log(task);
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
                        {task.location_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "33%",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        <div>
                          {task.tags &&
                            task.tags.map((tag) => (
                              <div key={tag.tag_id}> {tag.tag_name} </div>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          <br />
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <FormControl sx={{ width: "45%", marginRight: "5%" }}>
                <InputLabel id="sort-by-location-label">
                  Sort By Location
                </InputLabel>
                <Select
                  id="sort-by-location"
                  labelId="sort-by-location-label"
                  label="Sort by Location"
                  value={sortByLocation}
                  onChange={(event) => {
                    handleSubmitSort(event, "FETCH_BY_LOCATION_FOR_USER");
                    setSortByTags("");
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {allLocations.map((location) => (
                    <MenuItem key={location.location_id} value={location}>
                      {location.location_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "45%" }}>
                <InputLabel id="sort-by-tags-label">Sort By Tags</InputLabel>
                <Select
                  id="sort-by-tags"
                  labelId="sort-by-tags-label"
                  label="Sort by Tags"
                  value={sortByTags}
                  onChange={(event) => {
                    handleSubmitSort(event, "FETCH_BY_TAGS_FOR_USER");
                    setSortByLocation("");
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {allTags.map((tag) => (
                    <MenuItem key={tag.id} value={tag}>
                      {tag.tag_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Modal
            open={open}
            onClose={() => {
              handleClose();
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
              >
                <ClearIcon onClick={() => setOpen(false)} />
                {/* <pre>{JSON.stringify(infoOfSpecificTask)}</pre> */}
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
                        "MMMM Do YYYY, h:mm a"
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
                  Assigned To: {infoOfSpecificTask.assigned_to_first_name}{" "}
                  {infoOfSpecificTask.assigned_to_last_name}
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
                    onClick={() => {
                      handleOpenChild();
                    }}
                    sx={{
                      marginRight: "10%",
                      width: "40%",
                      maxWidth: "220px",
                      marginTop: "10px",
                      backgroundColor: "rgb(187, 41, 46)",
                      "&:hover": {
                        backgroundColor: "rgb(187, 41, 46)",
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    Comments
                  </Button>
                  <Button
                    variant="contained"
                    onClick={
                      infoOfSpecificTask.assigned_to_first_name
                        ? handleDropTask
                        : handleTakeTask
                    }
                    sx={{
                      width: "40%",
                      maxWidth: "220px",
                      marginTop: "10px",
                      backgroundColor: "rgb(187, 41, 46)",
                      "&:hover": {
                        backgroundColor: "rgb(187, 41, 46)",
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    {infoOfSpecificTask.assigned_to_first_name
                      ? "Drop"
                      : "Take"}
                  </Button>
                </Box>
              </Paper>
            </Stack>
          </Modal>
          <Modal
            open={openChild}
            onClose={() => {
              handleCloseChild();
            }}
            sx={{
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
                  padding: "20px",
                  "background-color": "rgb(241, 241, 241)",
                  width: "400px",
                }}
                elevation={3}
              >
                <ClearIcon onClick={() => setOpenChild(false)} />
                {/* <pre>{JSON.stringify(commentsForSpecificTask)}</pre> */}
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ textDecoration: "underline" }}
                ></Typography>
                <br />
                <TextField
                  type="text"
                  label="Comment"
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
                    {commentsForSpecificTask &&
                      commentsForSpecificTask.map((comment) => (
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
                <br />
              </Paper>
            </Stack>
          </Modal>
        </Paper>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        action={action}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}
