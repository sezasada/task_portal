import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import { useScript } from "../../../../../hooks/useScript";
import { useEffect } from "react";
import MarkChatUnreadRoundedIcon from "@mui/icons-material/MarkChatUnreadRounded";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Paper,
  Typography,
  List,
  ListItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Button,
  TextField,
  Autocomplete,
  Box,
  Card,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  TablePagination,
  TableContainer,
} from "@mui/material";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function AdminManageTasks() {
  const dispatch = useDispatch();

  // Access redux stores for tasks
  const infoOfSpecificTask = useSelector((store) => store.viewTaskInfoReducer);
  const allApprovedTasks = useSelector((store) => store.allTasksReducer);
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

  //Manage locations and tags
  const [newLocation, setNewLocation] = useState("");
  const [newTag, setNewTag] = useState("");
  const handleDeleteTag = (tagId) => {
	dispatch({type:"DELETE_TAG", payload: {tagID: tagId}});

  }
  const handleDeleteLocation = (locationId) => {
	dispatch({type:"DELETE_LOCATION", payload: {locationID: locationId}});

  }
  const handleAddTag = () =>{
	
	dispatch({type:"ADD_TAG", payload: {tagName: newTag}});
  }
  const handleAddLocation = () =>{
	dispatch({type:"ADD_LOCATION", payload: {locationName: newLocation}});
	
  }


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
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedTaskID, setEditedTaskID] = useState("");
  const [editedPhotos, setEditedPhotos] = useState("");
  const [editedAssignedTo, setEditedAssignedTo] = useState("");

  useEffect(() => {
    if (editMode) {
      setEditedTitle(infoOfSpecificTask.title);
      setEditedTags([]);
      setEditedLocation(allLocations[0]);
      setEditedBudget(infoOfSpecificTask.budget);
      setEditedNotes(infoOfSpecificTask.notes);
      setEditedDueDate("");
      setEditedTaskID(infoOfSpecificTask.task_id);
      setEditedPhotos([]);
    } else {
      setEditedTitle("");
      setEditedBudget("");
      setEditedNotes("");
      setEditedDueDate("");
    }
  }, [editMode, allApprovedTasks]);

  const submit_edits = () => {
    let has_budget = determineIfHasBudget(editedBudget);
    let is_time_sensitive;

    editedDueDate == null
      ? (is_time_sensitive = false)
      : (is_time_sensitive = true);

    const newObj = {
      title: editedTitle,
      tags: editedTags,
      notes: editedNotes,
      has_budget: has_budget,
      budget: editedBudget,
      location_id: editedLocation,
      is_time_sensitive,
      due_date: editedDueDate,
      task_id: editedTaskID,
      photos: editedPhotos,
      assigned_to_id: editedUserLookup,
    };

    dispatch({ type: "SUBMIT_EDITS", payload: newObj });
    setEditMode(!editMode);
    handleClose();
    dispatch({
      type: "SET_SNACKBAR_MESSAGE",
      payload: <Alert severity="success">Task Edited</Alert>,
    });
    handleOpenSnackbar();
  };

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

  // Manage Local state for task submission
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [location, setLocation] = useState(allLocations[0]);
  const [locationInput, setLocationInput] = useState("");
  const [budget, setBudget] = useState("");
  const [userLookup, setUserLookup] = useState(verifiedUsers[0]);
  const [userLookupInput, setUserLookupInput] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Due date in valid format
  const validDate = moment(dueDate).format("YYYY-MM-DD");

  function determineIfHasBudget(num) {
    let has_budget = false;
    if (num > 0) {
      has_budget = true;
    }
    return has_budget;
  }

  function determineTimeAssigned(userId) {
    let time_assigned;
    if (userId) {
      time_assigned = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    }
    return time_assigned;
  }

  function handleSubmitTask(event) {
    event.preventDefault();
    const newTaskObj = {
      title: title,
      notes: notes,
      has_budget: determineIfHasBudget(budget),
      budget: Number(budget),
      location_id: location.id,
      status: userLookup?.id ? "In Progress" : "Available",
      is_time_sensitive: moment(validDate).isValid(),
      due_date: moment(validDate).isValid() ? validDate : null,
      assigned_to_id: userLookup?.id,
      photos: state,
      tags: tags,
      time_assigned: determineTimeAssigned(userLookup?.id),
    };

    dispatch({ type: "ADD_NEW_TASK", payload: newTaskObj });

    setTitle("");
    setTags([]);
    setTagInput("");
    setLocation(allLocations[0]);
    setLocationInput("");
    setBudget("");
    setUserLookup(verifiedUsers[0]);
    setUserLookupInput("");
    setNotes("");
    setDueDate("");
    setState([]);

    dispatch({
      type: "SET_SNACKBAR_MESSAGE",
      payload: <Alert severity="success">Task Added to All Tasks</Alert>,
    });
    handleOpenSnackbar();
  }

  const [state, setState] = useState([]);

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

  //comments
  const [comment, setComment] = useState("");
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

  const handleCompleteTask = () => {
    dispatch({ type: "COMPLETE_TASK", payload: infoOfSpecificTask });
    handleClose();
    dispatch({
      type: "SET_SNACKBAR_MESSAGE",
      payload: <Alert severity="success">Task Marked as Completed</Alert>,
    });
    handleOpenSnackbar();
  };

  const handleTakeTask = () => {
    dispatch({ type: "TAKE_TASK", payload: infoOfSpecificTask });
    handleClose();
    dispatch({
      type: "SET_SNACKBAR_MESSAGE",
      payload: <Alert severity="success">Task Added to Your List</Alert>,
    });
    handleOpenSnackbar();
  };

  const handleDropTask = () => {
    dispatch({ type: "DROP_TASK", payload: infoOfSpecificTask });
    handleClose();
    dispatch({
      type: "SET_SNACKBAR_MESSAGE",
      payload: <Alert severity="warning">Task Dropped</Alert>,
    });
    handleOpenSnackbar();
  };

  const handleDeny = () => {
    dispatch({
      type: "DENY_TASK",
      payload: infoOfSpecificTask,
    });
    handleClose();
    dispatch({
      type: "SET_SNACKBAR_MESSAGE",
      payload: <Alert severity="error">Task Deleted</Alert>,
    });
    handleOpenSnackbar();
  };

  // ------------- TABLE SORTING --------------- //

  // Manage state for sorting options
  const [sortMode, setSortMode] = useState(false);
  const [sortByLocation, setSortByLocation] = useState("");
  const [sortByTags, setSortByTags] = useState("");
  const [sortByStatus, setSortByStatus] = useState("");

  const statuses = [
    // { id: undefined, status_name: "None" },
    { id: 1, status_name: "Available" },
    { id: 2, status_name: "In Progress" },
  ];

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
      if (type === "FETCH_BY_LOCATION") {
        setSortByLocation(event.target.value);
      } else if (type === "FETCH_BY_TAGS") {
        setSortByTags(event.target.value);
      } else if (type === "FETCH_BY_STATUS") {
        setSortByStatus(event.target.value.status_name);
      }
      return;
    }

    activateSortMode();
    if (type === "FETCH_BY_LOCATION") {
      setSortByLocation(event.target.value);
    } else if (type === "FETCH_BY_TAGS") {
      setSortByTags(event.target.value);
    } else if (type === "FETCH_BY_STATUS") {
      setSortByStatus(event.target.value.status_name);
      handleSort(type, event.target.value.status_name);
      return;
    }

    handleSort(type, event.target.value.id);
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [page1, setPage1] = useState(0);
  const [rowsPerPage1, setRowsPerPage1] = useState(5);

  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handleChangeRowsPerPage1 = (event) => {
    setRowsPerPage1(+event.target.value);
    setPage1(0);
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
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography>All Tasks</Typography>
        {/* <pre>{JSON.stringify(allApprovedTasks)}</pre> */}
        <TableContainer sx={{ height: "325px", overflow: "scroll" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortMode
                ? sortedTasks
                    .slice(
                      page1 * rowsPerPage1,
                      page1 * rowsPerPage1 + rowsPerPage1
                    )
                    .map((task) => (
                      <TableRow
                        hover
                        key={task.id}
                        onClick={() => {
                          handleOpen();
                          dispatch({ type: "VIEW_TASK_INFO", payload: task });
                        }}
                      >
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.location_name}</TableCell>
                        <TableCell>
                          {" "}
                          {task.due_date != null
                            ? moment(task.due_date).format(
                                "MMMM Do YYYY, h:mm a"
                              )
                            : " "}
                        </TableCell>
                        <TableCell>{task.status}</TableCell>
                      </TableRow>
                    ))
                : allApprovedTasks
                    .slice(
                      page1 * rowsPerPage1,
                      page1 * rowsPerPage1 + rowsPerPage1
                    )
                    .map((task) => (
                      <TableRow
                        hover
                        key={task.id}
                        onClick={() => {
                          handleOpen();
                          dispatch({ type: "VIEW_TASK_INFO", payload: task });
                        }}
                      >
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.location_name}</TableCell>
                        <TableCell>
                          {" "}
                          {task.due_date != null
                            ? moment(task.due_date).format(
                                "MMMM Do YYYY, h:mm a"
                              )
                            : " "}
                        </TableCell>
                        <TableCell>{task.status}</TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 25]}
          component="div"
          count={allApprovedTasks.length}
          rowsPerPage={rowsPerPage1}
          page={page1}
          onPageChange={handleChangePage1}
          onRowsPerPageChange={handleChangeRowsPerPage1}
        />
        <br />
        <Box>
          <Box>
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="sort-by-location-label">
                Sort By Location
              </InputLabel>
              <Select
                id="sort-by-location"
                labelId="sort-by-location-label"
                label="Sort by Location"
                value={sortByLocation}
                onChange={(event) => {
                  handleSubmitSort(event, "FETCH_BY_LOCATION");
                  setSortByStatus("");
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
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="sort-by-tags-label">Sort By Tags</InputLabel>
              <Select
                id="sort-by-tags"
                labelId="sort-by-tags-label"
                label="Sort by Tags"
                value={sortByTags}
                onChange={(event) => {
                  handleSubmitSort(event, "FETCH_BY_TAGS");
                  setSortByLocation("");
                  setSortByStatus("");
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
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="sort-by-status-label">Sort By Status</InputLabel>
              <Select
                id="sort-by-status"
                labelId="sort-by-status-label"
                label="Sort by Status"
                value={sortByStatus}
                onChange={(event) => {
                  handleSubmitSort(event, "FETCH_BY_STATUS");
                  console.log(event.target.value);
                  setSortByLocation("");
                  setSortByTags("");
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status}>
                    {status.status_name}
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
              }}
            >
              <ClearIcon onClick={() => setOpen(false)} />
              {/* <pre>{JSON.stringify(infoOfSpecificTask)}</pre> */}
              <Typography
                variant="h4"
                component="h2"
                sx={{ textDecoration: "underline" }}
              >
                Task Info
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Title: {""}
                {editMode ? (
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
                ) : (
                  infoOfSpecificTask.title
                )}
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Tags:{""}
              </Typography>

              {editMode ? (
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
              ) : (
                <ul>
                  {specificTaskTags &&
                    specificTaskTags.map((tag) => (
                      <li key={tag.tag_id}>{tag.tag_name}</li>
                    ))}
                </ul>
              )}
              <br />
              <Typography variant="h6" component="h4">
                Budget: {""}
                {editMode ? (
                  <>
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
                      onChange={(event) => setEditedBudget(event.target.value)}
                      variant="outlined"
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </>
                ) : (
                  `$${infoOfSpecificTask.budget}`
                )}
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Location: {""}
                {editMode ? (
                  <Autocomplete
                    required
                    sx={{
                      width: 300,
                      marginBottom: 1,
                    }}
                    value={editedLocation}
                    onChange={(event, newValue) => setEditedLocation(newValue)}
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
                ) : (
                  infoOfSpecificTask.location_name
                )}
              </Typography>
              <br />

              <Typography>
                Due Date:{" "}
                {editMode ? (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      value={editedDueDate}
                      sx={{ marginBottom: 1, width: 300 }}
                      onChange={(newValue) => setEditedDueDate(newValue)}
                    />
                  </LocalizationProvider>
                ) : infoOfSpecificTask.due_date != null ? (
                  moment(infoOfSpecificTask.due_date).format(
                    "MMMM Do YYYY, h:mm a"
                  )
                ) : (
                  " "
                )}
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Created By: {infoOfSpecificTask.created_by_first_name}{" "}
                {infoOfSpecificTask.created_by_last_name}
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Assigned To: {""}
                {editMode ? (
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
                ) : infoOfSpecificTask.assigned_to_first_name == null ? (
                  " "
                ) : (
                  `${infoOfSpecificTask.assigned_to_first_name}
					${infoOfSpecificTask.assigned_to_last_name}`
                )}
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Notes: {""}
                {editMode ? (
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
                ) : (
                  `${infoOfSpecificTask.notes}`
                )}
              </Typography>
              {editMode ? (
                <>
                  <Button
                    variant="contained"
                    type="button"
                    onClick={openWidget}
                    sx={{ width: 300 }}
                  >
                    Pick File
                  </Button>

                  {editedPhotos &&
                    editedPhotos.map((item) => {
                      return <img src={item.photo_url} width={100} />;
                    })}
                </>
              ) : (
                <>
                  {photosForTask != null &&
                    photosForTask.map((item) => {
                      return <img src={item.photo_url} width={100} />;
                    })}
                </>
              )}

              <Button
                variant="contained"
                onClick={() => {
                  handleOpenChild();
                }}
              >
                {" "}
                {commentsForSpecificTask?.length === 0 ? (
                  `Comments`
                ) : (
                  <>
                    {" "}
                    Comments&nbsp;
                    <MarkChatUnreadRoundedIcon />{" "}
                  </>
                )}
              </Button>

              <Button
                variant="contained"
                onClick={
                  infoOfSpecificTask.assigned_to_first_name
                    ? handleDropTask
                    : handleTakeTask
                }
              >
                {infoOfSpecificTask.assigned_to_first_name
                  ? "Unassign from personal list"
                  : "Take"}
              </Button>

              <Button variant="contained" onClick={handleCompleteTask}>
                Mark Task Complete
              </Button>

              {editMode ? (
                <Button variant="contained" onClick={() => submit_edits()}>
                  Submit Changes
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setEditMode(!editMode)}
                >
                  Edit
                </Button>
              )}

              <Button variant="contained" onClick={handleDeny}>
                Delete
              </Button>
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
                    }}
                    onChange={(event) => setComment(event.target.value)}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <Button
                          variant="contained"
                          onClick={handleSubmitComment}
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
          </Stack>
        </Modal>
      </Paper>
      <Paper>
        <Stack>
          <Typography>Create a New Task</Typography>
          <form onSubmit={handleSubmitTask}>
            <Stack>
              <TextField
                required
                type="text"
                label="Title"
                value={title}
                sx={{
                  marginBottom: 1,
                  width: 300,
                }}
                onChange={(event) => setTitle(event.target.value)}
                variant="outlined"
              />
              <Autocomplete
                sx={{
                  width: 300,
                  marginBottom: 1,
                }}
                multiple
                value={tags}
                onChange={(event, newValue) => setTags(newValue)}
                inputValue={tagInput}
                onInputChange={(event, newInputValue) =>
                  setTagInput(newInputValue)
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
              <Autocomplete
                sx={{
                  width: 300,
                  marginBottom: 1,
                }}
                value={location}
                onChange={(event, newValue) => setLocation(newValue)}
                inputValue={locationInput}
                onInputChange={(event, newInputValue) =>
                  setLocationInput(newInputValue)
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
              <Autocomplete
                sx={{
                  width: 300,
                  marginBottom: 1,
                }}
                value={userLookup}
                onChange={(event, newValue) => setUserLookup(newValue)}
                inputValue={userLookupInput}
                onInputChange={(event, newInputValue) =>
                  setUserLookupInput(newInputValue)
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
              <FormControl>
                <InputLabel htmlFor="budget-input">Budget</InputLabel>
                <OutlinedInput
                  type="number"
                  id="budget-input"
                  label="Budget"
                  value={budget}
                  sx={{
                    marginBottom: 1,
                    width: 300,
                  }}
                  onChange={(event) => setBudget(event.target.value)}
                  variant="outlined"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                />
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    sx={{ marginBottom: 1, width: 300 }}
                    value={dueDate}
                    onChange={(newValue) => setDueDate(newValue)}
                  />
                </LocalizationProvider>
              </FormControl>

              <p>Upload New File</p>
              {/* This just sets up the window.cloudinary widget */}
              {useScript("https://widget.cloudinary.com/v2.0/global/all.js")}

              <Button
                variant="contained"
                type="button"
                onClick={openWidget}
                sx={{ width: 300 }}
              >
                Pick File
              </Button>
              <br />

              {state &&
                state.map((item) => {
                  return <img src={item.photo_url} width={100} />;
                })}
              <br />
              <TextField
                type="text"
                label="Notes"
                value={notes}
                sx={{
                  marginBottom: 1,
                  width: 300,
                }}
                onChange={(event) => setNotes(event.target.value)}
                variant="outlined"
              />
              <Button
                variant="contained"
                type="submit"
                sx={{
                  marginBottom: 1,
                  width: 300,
                }}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
      <Paper sx={{ p: 3 }} elevation={3}>
        {/* <pre>{JSON.stringify(allCompletedTasks)}</pre> */}
        <Typography>All Completed Tasks</Typography>
        <TableContainer sx={{ height: "325px", overflow: "scroll" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Completed By</TableCell>
                <TableCell>Date Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allCompletedTasks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((task) => (
                  <TableRow
                    hover
                    key={task.id}
                    onClick={() => {
                      handleOpen2();
                      dispatch({ type: "VIEW_TASK_INFO", payload: task });
                    }}
                  >
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      {task.assigned_to_first_name} {task.assigned_to_last_name}
                    </TableCell>
                    <TableCell>
                      {moment(task.time_completed).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 25]}
          component="div"
          count={allCompletedTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Modal
          open={open2}
          onClose={() => {
            handleClose2();
            dispatch({ type: "UNVIEW_TASK_INFO" });
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
              }}
              elevation={3}
            >
              <ClearIcon onClick={() => setOpen2(false)} />
              <Typography
                variant="h4"
                component="h2"
                sx={{ textDecoration: "underline" }}
              >
                Task Info
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Title: {infoOfSpecificTask.title}
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Tags:
              </Typography>

              <ul>
                {specificTaskTags &&
                  specificTaskTags.map((tag) => (
                    <li key={tag.tag_id}>{tag.tag_name}</li>
                  ))}
              </ul>
              <br />
              <Typography variant="h6" component="h4">
                Budget: ${infoOfSpecificTask.budget}
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Location: {infoOfSpecificTask.location_name}
              </Typography>
              <br />
              <Typography>
                Due Date:{" "}
                {infoOfSpecificTask.due_date != null
                  ? moment(infoOfSpecificTask.due_date).format(
                      "MMMM Do YYYY, h:mm a"
                    )
                  : " "}
              </Typography>
              <br />
              <Typography variant="h6" component="h4">
                Created By: {infoOfSpecificTask.created_by_first_name}{" "}
                {infoOfSpecificTask.created_by_last_name}
              </Typography>
              <Typography variant="h6" component="h4">
                Assigned To: {infoOfSpecificTask.assigned_to_first_name}{" "}
                {infoOfSpecificTask.assigned_to_last_name}
              </Typography>
              <br />
              <br />
              <Typography variant="h6" component="h4">
                Notes: {infoOfSpecificTask.notes}
              </Typography>
              {photosForTask ? (
                <Typography variant="h6" component="h4">
                  Photos:
                </Typography>
              ) : (
                ""
              )}
              {photosForTask &&
                photosForTask.map((item) => {
                  return <img src={item.photo_url} width={100} />;
                })}
              <Typography variant="h6" component="h4">
                Comments:
              </Typography>
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
            </Paper>
          </Stack>
        </Modal>
      </Paper>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" component="h4">
          Manage Tags:
        </Typography>
		<TableContainer sx={{ height: "325px", overflow: "scroll" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Tag Name</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTags
                .map((tag) => (
					
                  <TableRow
                    hover
                    key={tag.id}
                  >
                    <TableCell>{tag.tag_name}</TableCell>
                    <TableCell>
					<Button
                    variant="contained"
                    type="button"
                    onClick={()=> handleDeleteTag(tag.id)}
                    sx={{ 
						width: 100 ,
						backgroundColor: "rgb(187, 41, 46)",
						"&:hover": {
							backgroundColor: "rgb(187, 41, 46)",
							transform: "scale(1.03)",
						  },
					}}
                  >Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
		<TextField
                    type="text"
                    label="Add new tag"
                    value={newTag}
                    sx={{
                      marginBottom: 1,
                      width: 300,
                    }}
                    onChange={(event) => setNewTag(event.target.value)}
                    variant="outlined"
					InputProps={{
						endAdornment: (
						  <Button
							variant="contained"
							onClick={() => handleAddTag()}
							sx={{
							  backgroundColor: "rgb(187, 41, 46)",
							  "&:hover": {
								backgroundColor: "rgb(187, 41, 46)",
								transform: "scale(1.03)",
							  },
							}}
						  >
							Add
						  </Button>
						),
					  }}
                  />
      </Paper>
	  <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" component="h4">
          Manage Locations:
        </Typography>
		<TableContainer sx={{ height: "325px", overflow: "scroll" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allLocations
                .map((location) => (
                  <TableRow
                    hover
                    key={location.id}
                  >
                    <TableCell>{location.location_name}</TableCell>
                    <TableCell>
					 <Button
                    variant="contained"
                    type="button"
                    onClick={()=> handleDeleteLocation(location.id)}
                    sx={{ 
						width: 100 ,
						backgroundColor: "rgb(187, 41, 46)",
						"&:hover": {
							backgroundColor: "rgb(187, 41, 46)",
							transform: "scale(1.03)",
						  },
					 }}
                  >Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
		<TextField
                    type="text"
                    label="Add new location"
                    value={newLocation}
                    sx={{
                      marginBottom: 1,
                      width: 300,
                    }}
                    onChange={(event) => setNewLocation(event.target.value)}
                    variant="outlined"
					InputProps={{
						endAdornment: (
						  <Button
							variant="contained"
							onClick={() => handleAddLocation()}
							sx={{
							  backgroundColor: "rgb(187, 41, 46)",
							  "&:hover": {
								backgroundColor: "rgb(187, 41, 46)",
								transform: "scale(1.03)",
							  },
							}}
						  >
							Add
						  </Button>
						),
					  }}
                  />
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </Stack>
  );
  å;
}
