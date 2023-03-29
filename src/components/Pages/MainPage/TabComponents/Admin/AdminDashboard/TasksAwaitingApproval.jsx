import {

  Button,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableRow,
  TextField,
  Autocomplete,
  Box,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  List,
  ListItem,
  Card,
  FormControl,
  ImageList,
  ImageListItem,
  Snackbar,
  Alert,

} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useScript } from "../../../../../../hooks/useScript";

export default function TasksAwaitingApproval() {

  const dispatch = useDispatch();

  // Access redux stores and define new variables
  const incomingTasks = useSelector((store) => store.incomingTasksReducer);
  const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
  const specificTaskTags = infoOfSpecificTask.tags;
  const photosForTask = infoOfSpecificTask.photos;
  // Access redux store for all locations
  const allLocations = useSelector((store) => store.allLocationsReducer);
  // Access redux store for all users
  const verifiedUsers = useSelector((store) => store.verifiedUsersReducer);
  // Access redux store for all tags
  const allTags = useSelector((store) => store.allTagsReducer);

  const [comment, setComment] = useState("");

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

  const [openChild, setOpenChild] = useState(false);
  //opens comments
  const handleOpenChild = () => {
    setOpenChild(true);
    dispatch({
      type: "FETCH_COMMENTS_FOR_TASK",
      payload: { task_id: infoOfSpecificTask.task_id },
    });
  };
  const handleCloseChild = () => setOpenChild(false);
  const commentsForTask = useSelector((store) => store.commentsForTaskReducer);

  //Manage edit mode
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedTags, setEditedTags] = useState([]);
  const [editedTagInput, setEditedTagInput] = useState("");
  const [editedLocation, setEditedLocation] = useState(allLocations[0]);
  const [editedLocationInput, setEditedLocationInput] = useState("");
  const [editedBudget, setEditedBudget] = useState("");
  const [editedUserLookup, setEditedUserLookup] = useState(verifiedUsers[0]);
  const [editedUserLookupInput, setEditedUserLookupInput] = useState("");
  const [editedNotes, setEditedNotes] = useState("");
  const [editedDueDate, setEditedDueDate] = useState(
    new Date(infoOfSpecificTask.due_date)
  );
  const [editedTaskID, setEditedTaskID] = useState("");
  const [editedPhotos, setEditedPhotos] = useState("");

  useEffect(() => {
    if (editMode) {
      const formattedDate = moment(infoOfSpecificTask.due_date).format(
        "YYYY-MM-DD"
      );
      let currentTags;
      infoOfSpecificTask.tags
        ? (currentTags = infoOfSpecificTask.tags)
        : (currentTags = []);

		let currentLocationObject = {
			id: infoOfSpecificTask.location_id,
			location_name: infoOfSpecificTask.location_name,
		}

      setEditedTitle(infoOfSpecificTask.title);
      setEditedTags(currentTags);
      setEditedLocation(currentLocationObject);
	  setEditedLocationInput(infoOfSpecificTask.location_name);
      setEditedBudget(infoOfSpecificTask.budget);
      setEditedNotes(infoOfSpecificTask.notes);
      setEditedDueDate(moment(formattedDate));
      setEditedTaskID(infoOfSpecificTask.task_id);
      setEditedPhotos(infoOfSpecificTask.photos);
    } else {
      setEditedTitle("");
      setEditedBudget("");
      setEditedNotes("");
      setEditedDueDate("");
    }
  }, [editMode, incomingTasks]);
  
  const submit_edits = () => {
    let has_budget = determineIfHasBudget(editedBudget);
    let is_time_sensitive;

    let assigned_to_id;

    let listOfTagIds = [];
    for (let tag of editedTags) {
      if (tag.id) {
        listOfTagIds.push(tag.id);
      } else if (tag.tag_id) {
        listOfTagIds.push(tag.tag_id);
      }
    }

    !editedUserLookup
      ? (assigned_to_id = "none")
      : (assigned_to_id = editedUserLookup);

    editedDueDate == null
      ? (is_time_sensitive = false)
      : (is_time_sensitive = true);

    const newObj = {
      title: editedTitle,
      tags: listOfTagIds,
      notes: editedNotes,
      has_budget: has_budget,
      budget: editedBudget,
      location_id: editedLocation,
      is_time_sensitive,
      due_date: editedDueDate,
      task_id: editedTaskID,
      photos: editedPhotos,
      assigned_to_id: assigned_to_id,
    };
    console.log("newObj", newObj);

    dispatch({ type: "SUBMIT_EDITS", payload: newObj });
    setEditMode(!editMode);
    handleClose();
    dispatch({
      type: "SET_SNACKBAR_MESSAGE",
      payload: <Alert severity="success">Task Edited</Alert>,
    });
    handleOpenSnackbar();
  };

  function determineIfHasBudget(num) {
    let has_budget = false;
    if (num > 0) {
      has_budget = true;
    }
    return has_budget;
  }

  const [state, setState] = useState([]);
  useScript("https://widget.cloudinary.com/v2.0/global/all.js");

  const openWidget = () => {
    // Currently there is a bug with the Cloudinary <Widget /> component
    // where the button defaults to a non type="button" which causes the form
    // to submit when clicked. So for now just using the standard widget that
    // is available on window.cloudinary
    // See docs: https://cloudinary.com/documentation/upload_widget#look_and_feel_customization
    !!window.cloudinary &&
      window.cloudinary
        .createUploadWidget(
          {
            sources: ["local", "url", "camera"],
            cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
            uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              const newPhoto = { photo_url: result.info.secure_url };

              if (!editMode) {
                // When an upload is successful, save the uploaded URL to local state!
                setState([...state, newPhoto]);
              } else if (editMode) {
                // When an upload is successful, save the uploaded URL to local state!
                setEditedPhotos([...editedPhotos, newPhoto]);
              }
            }
          }
        )
        .open();
  };

  // Manage opening and closing of first details modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
	setOpen(false)
	setEditMode(false);
};

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

  return (
    <>
      <Paper
        sx={{
          p: 3,
          maxWidth: "750px",
          width: "90%",
          backgroundColor: "rgb(241, 241, 241)",
        }}
        elevation={3}
      >
        {/* <pre>{JSON.stringify(incomingTasks)}</pre> */}
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3vh",
            color: "rgb(187, 41, 46)",
          }}
        >
          Tasks awaiting approval
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
            {incomingTasks.map((task) => (
              <TableRow
                key={task.id}
                onClick={() => {
                  handleOpen();
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
              <ClearIcon
                onClick={() => {
                  setOpen(false);
                  setEditMode(false);
                }}
              />
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
              <Typography variant="h6" component="h4">
                {editMode ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      required
                      type="text"
                      label="Title"
                      value={editedTitle}
                      sx={{
                        marginBottom: 1,
                        width: 300,
                      }}
                      variant="outlined"
                      onChange={(event) => setEditedTitle(event.target.value)}
                    />
                  </Box>
                ) : (
                  <>
                    <Box sx={{ borderBottom: "1px solid grey" }}>
                      Title: {""}
                      {infoOfSpecificTask.title}
                    </Box>
                    <br
                      style={{ display: "block", height: "1em", content: '""' }}
                    />
                  </>
                )}
              </Typography>

              {editMode ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Autocomplete
                    sx={{
                      width: 300,
                      marginBottom: 1,
                    }}
                    multiple
                    value={editedTags}
                    onChange={(event, newValue) => setEditedTags(newValue)}
                    inputValue={editedTagInput}
                    onInputChange={(event, newInputValue) =>
                      setEditedTagInput(newInputValue)
                    }
                    id="all-tags-lookup"
                    getOptionLabel={(allTags) => `${allTags.tag_name}`}
                    options={allTags}
                    isOptionEqualToValue={(option, value) =>
                      option.tag_name === value.tag_name
                    }
                    noOptionsText={"No valid tags"}
                    renderOption={(props, allTags) => (
                      <Box component="li" {...props} key={allTags.id}>
                        {allTags.tag_name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Add Tags" />
                    )}
                  />
                </Box>
              ) : (
                <>
                  <Typography
                    variant="h6"
                    component="h4"
                    sx={{ borderBottom: "1px solid grey" }}
                  >
                    Tags:{""}
                  </Typography>

                  <ul>
                    {specificTaskTags &&
                      specificTaskTags.map((tag) => (
                        <li key={tag.tag_id}>{tag.tag_name}</li>
                      ))}
                  </ul>
                </>
              )}
              <Typography variant="h6" component="h4">
                {editMode ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <>
                      <FormControl sx={{ marginBottom: 1 }}>
                        <InputLabel htmlFor="budget-input">Budget</InputLabel>
                        <OutlinedInput
                          type="number"
                          id="budget-input"
                          label="Budget"
                          value={editedBudget}
                          sx={{
                            marginBottom: 1,
                            width: 300,
                          }}
                          onChange={(event) =>
                            setEditedBudget(event.target.value)
                          }
                          variant="outlined"
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                        />
                      </FormControl>
                    </>
                  </Box>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ borderBottom: "1px solid grey" }}
                    >
                      Budget: {""} {`$${infoOfSpecificTask.budget}`}
                    </Typography>
                    <br
                      style={{ display: "block", height: "1em", content: '""' }}
                    />
                  </>
                )}
              </Typography>

              <Typography variant="h6" component="h4">
                {editMode ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Autocomplete
                      required
                      sx={{
                        width: 300,
                        marginBottom: 1,
                      }}
                      value={editedLocation}
                      onChange={(event, newValue) =>
                        setEditedLocation(newValue)
                      }
                      inputValue={editedLocationInput}
                      onInputChange={(event, newInputValue) =>
                        setEditedLocationInput(newInputValue)
                      }
                      id="all-locations-lookup"
                      getOptionLabel={(allLocations) =>
                        `${allLocations.location_name}`
                      }
                      options={allLocations}
                      isOptionEqualToValue={(option, value) =>
                        option.location_name === value.location_name
                      }
                      noOptionsText={"No valid locations"}
                      renderOption={(props, allLocations) => (
                        <Box component="li" {...props} key={allLocations.id}>
                          {allLocations.location_name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Add Location" required />
                      )}
                    />
                  </Box>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ borderBottom: "1px solid grey" }}
                    >
                      Location: {""} {infoOfSpecificTask.location_name}
                    </Typography>
                    <br
                      style={{ display: "block", height: "1em", content: '""' }}
                    />
                  </>
                )}
              </Typography>
              {editMode ? (
                <Box>
                  <>
                    {/* This just sets up the window.cloudinary widget */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ marginRight: "5%" }}>Upload New File:</p>
                      <Button
                        variant="contained"
                        type="button"
                        onClick={openWidget}
                        sx={{
                          width: "20%",
                          backgroundColor: "rgb(187, 41, 46)",
                          "&:hover": {
                            backgroundColor: "rgb(187, 41, 46)",
                            transform: "scale(1.03)",
                          },
                        }}
                      >
                        Pick File
                      </Button>
                    </div>

                    {editedPhotos &&
                      editedPhotos.map((item) => {
                        return <img src={item.photo_url} width={100} />;
                      })}
                  </>
                </Box>
              ) : (
                // if there is no image, there's a big space under location. Might neet to fix that.
                <ImageList class="image_line">
                  {photosForTask != null &&
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
              )}
              <Typography>
                {editMode ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        value={editedDueDate}
                        sx={{ marginBottom: 1, width: 300 }}
                        onChange={(newValue) => setEditedDueDate(newValue)}
                      />
                    </LocalizationProvider>
                  </Box>
                ) : infoOfSpecificTask.due_date != null ? (
                  moment(infoOfSpecificTask.due_date).format(
                    "MMMM DD YYYY, h:mm a"
                  )
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ borderBottom: "1px solid grey" }}
                    >
                      Due Date:{" "}
                    </Typography>{" "}
                    <br
                      style={{ display: "block", height: "1em", content: '""' }}
                    />
                  </>
                )}
              </Typography>

              <Typography variant="h6" component="h4">
                {editMode ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Autocomplete
                      sx={{
                        width: 300,
                        marginBottom: 1,
                      }}
                      value={editedUserLookup}
                      onChange={(event, newValue) => {
                        setEditedUserLookup(newValue);
                      }}
                      inputValue={editedUserLookupInput}
                      onInputChange={(event, newInputValue) =>
                        setEditedUserLookupInput(newInputValue)
                      }
                      id="all-verified-users-lookup"
                      getOptionLabel={(verifiedUsers) =>
                        `${verifiedUsers.first_name} ${verifiedUsers.last_name}`
                      }
                      options={verifiedUsers}
                      isOptionEqualToValue={(option, value) =>
                        option.first_name === value.first_name
                      }
                      noOptionsText={"No valid users"}
                      renderOption={(props, verifiedUsers) => (
                        <Box component="li" {...props} key={verifiedUsers.id}>
                          {verifiedUsers.first_name} {verifiedUsers.last_name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Assign to User" />
                      )}
                    />
                  </Box>
                ) : infoOfSpecificTask.assigned_to_first_name == null ? (
                  " "
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ borderBottom: "1px solid grey" }}
                    >
                      Assigned To: {""}{" "}
                      {`${infoOfSpecificTask.assigned_to_first_name}

					          ${infoOfSpecificTask.assigned_to_last_name}`}
                    </Typography>
                    <br
                      style={{ display: "block", height: "1em", content: '""' }}
                    />
                  </>
                )}
              </Typography>

              <Typography variant="h6" component="h4">
                {editMode ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      type="text"
                      label="Notes"
                      value={editedNotes}
                      sx={{
                        marginBottom: 1,
                        width: 300,
                      }}
                      onChange={(event) => setEditedNotes(event.target.value)}
                      variant="outlined"
                    />
                  </Box>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ borderBottom: "1px solid grey" }}
                    >
                      Notes: {""} {`${infoOfSpecificTask.notes}`}
                    </Typography>
                    <br
                      style={{ display: "block", height: "1em", content: '""' }}
                    />
                  </>
                )}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    marginRight: "10%",
                    width: "40%",
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
                  sx={{
                    width: "40%",
                    maxWidth: "220px",
                    marginTop: "5px",
                    backgroundColor: "rgb(187, 41, 46)",
                    "&:hover": {
                      backgroundColor: "rgb(187, 41, 46)",
                      transform: "scale(1.03)",
                    },
                  }}
                  onClick={() => {
                    dispatch({
                      type: "MARK_TASK_APPROVED",
                      payload: { task_id: infoOfSpecificTask.task_id },
                    });
                    handleClose();
                    dispatch({
                      type: "SET_SNACKBAR_MESSAGE",
                      payload: <Alert severity="success">Task Approved</Alert>,
                    });
                    handleOpenSnackbar();
                  }}
                >
                  Approve
                </Button>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    marginRight: "10%",
                    width: "40%",
                    maxWidth: "220px",
                    marginTop: "5px",
                    backgroundColor: "rgb(187, 41, 46)",
                    "&:hover": {
                      backgroundColor: "rgb(187, 41, 46)",
                      transform: "scale(1.03)",
                    },
                  }}
                  onClick={() => {
                    dispatch({
                      type: "DENY_TASK",
                      payload: infoOfSpecificTask,
                    });
                    handleClose();
                    dispatch({
                      type: "SET_SNACKBAR_MESSAGE",
                      payload: <Alert severity="warning">Task Denied</Alert>,
                    });
                    handleOpenSnackbar();
                  }}
                >
                  Deny
                </Button>
                {editMode ? (
                  <Button
                    variant="contained"
                    onClick={() => submit_edits()}
                    sx={{
                      width: "40%",
                      maxWidth: "220px",
                      marginTop: "5px",
                      backgroundColor: "rgb(187, 41, 46)",
                      "&:hover": {
                        backgroundColor: "rgb(187, 41, 46)",
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    Submit Changes
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      width: "40%",
                      maxWidth: "220px",
                      marginTop: "5px",
                      backgroundColor: "rgb(187, 41, 46)",
                      "&:hover": {
                        backgroundColor: "rgb(187, 41, 46)",
                        transform: "scale(1.03)",
                      },
                    }}
                    onClick={() => setEditMode(!editMode)}
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </Paper>
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}
