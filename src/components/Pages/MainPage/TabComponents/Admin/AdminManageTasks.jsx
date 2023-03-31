import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import { useScript } from "../../../../../hooks/useScript";
import { useEffect } from "react";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CheckIcon from "@mui/icons-material/Check";
import swal from 'sweetalert';
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
  ImageList,
} from "@mui/material";
import moment from "moment";
import { IconButton } from "@mui/material";
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
    swal({
      title: "Are you sure?",
      text: 'This action will delete this tag from the system. If any tasks are assigned to this tag, they will be updated to the tag "Other"',
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        swal("Tag Deleted", "", "success");
        dispatch({ type: "DELETE_TAG", payload: { tagID: tagId } });
      }
      else {
        swal("Tag not deleted.");
      }
    });
  };
  const handleDeleteLocation = (locationId) => {
    
    swal({
      title: "Are you sure?",
      text: 'This action will delete this location from the system. If any tasks are assigned to this location, they will be updated to the location "Other"',
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        swal("Location Deleted", "", "success");
        dispatch({ type: "DELETE_LOCATION", payload: { locationID: locationId } });
      }
      else {
        swal("Location not deleted.");
      }
    });
  };
  const handleAddTag = () => {
    dispatch({ type: "ADD_TAG", payload: { tagName: newTag } });
    setNewTag("");
  };
  const handleAddLocation = () => {
    dispatch({ type: "ADD_LOCATION", payload: { locationName: newLocation } });
    setNewLocation("");
  };

  //Manage edit mode
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedTags, setEditedTags] = useState([]);
  const [editedTagInput, setEditedTagInput] = useState("");
  const [editedLocation, setEditedLocation] = useState(allLocations[0]);
  const [editedLocationInput, setEditedLocationInput] = useState("");
  const [editedBudget, setEditedBudget] = useState("");
  const [editedUserLookup, setEditedUserLookup] = useState();
  const [editedUserLookupInput, setEditedUserLookupInput] = useState();
  const [editedNotes, setEditedNotes] = useState("");
  const [editedDueDate, setEditedDueDate] = useState();
  const [editedTaskID, setEditedTaskID] = useState("");
  const [editedPhotos, setEditedPhotos] = useState("");

  useEffect(() => {
    if (editMode) {
      let currentAssignedTo = verifiedUsers.find(
        (user) => user.id === infoOfSpecificTask.assigned_to_id
      );
      console.log("currentAssignedTo", currentAssignedTo);

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
      };

      let photos = [];
      infoOfSpecificTask.photos
        ? (photos = infoOfSpecificTask.photos)
        : (photos = []);
      setEditedTitle(infoOfSpecificTask.title);
      setEditedTags(currentTags);
      setEditedLocation(currentLocationObject);
      setEditedLocationInput(infoOfSpecificTask.location_name);
      setEditedBudget(infoOfSpecificTask.budget);
      setEditedNotes(infoOfSpecificTask.notes);
      setEditedDueDate(moment(formattedDate));
      setEditedTaskID(infoOfSpecificTask.task_id);
      setEditedPhotos(photos);
      setEditedUserLookup(currentAssignedTo);
      // setEditedUserLookupInput(currentAssignedTo.first_name);
    } else {
      setEditedTitle("");
      setEditedBudget("");
      setEditedNotes("");
      setEditedDueDate("");
      setEditedUserLookup();
      setEditedUserLookupInput("");
      setEditedTags([]);
      setEditedTagInput("");
      setEditedLocation(allLocations[0]);
      setEditedLocationInput("");
      setEditedTaskID("");
      setEditedPhotos("");
    }
  }, [editMode, allApprovedTasks]);

  const submit_edits = () => {
    let has_budget = determineIfHasBudget(editedBudget);
    let is_time_sensitive;

    let assigned_to_id;
    !editedUserLookup
      ? (assigned_to_id = "none")
      : (assigned_to_id = editedUserLookup);

    let listOfTagIds = [];
    for (let tag of editedTags) {
      if (tag.id) {
        listOfTagIds.push(tag.id);
      } else if (tag.tag_id) {
        listOfTagIds.push(tag.tag_id);
      }
    }

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

  // Manage opening and closing of details modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

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
    swal({
      title: "Are you sure?",
      text: "This action will delete this task from the system.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        swal("Task Deleted", "", "success");
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
      }
      else {
        swal("Task not deleted.");
      }
    });

    

  };

  // ------------- TABLE SORTING --------------- //

  // Manage state for sorting options
  const [sortMode, setSortMode] = useState(false);
  const [sortByLocation, setSortByLocation] = useState("");
  const [sortByTags, setSortByTags] = useState("");
  const [sortByStatus, setSortByStatus] = useState("");

  const statuses = [
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
    console.log("this is the id:", event.target.value.id);
    console.log("this is the value:", event.target.value);
    if (event.target.value.id === undefined && event.target.value === "") {
      deactivateSortMode();
      if (type === "FETCH_BY_LOCATION") {
        setSortByLocation(event.target.value);
      } else if (type === "FETCH_BY_TAGS") {
        setSortByTags(event.target.value);
      } else if (type === "FETCH_BY_STATUS") {
        setSortByStatus(event.target.value);
      }
      return;
    }

    activateSortMode();
    if (type === "FETCH_BY_LOCATION") {
      setSortByLocation(event.target.value);
    } else if (type === "FETCH_BY_TAGS") {
      setSortByTags(event.target.value);
    } else if (type === "FETCH_BY_STATUS") {
      if (event.target.value === "Available") {
        setSortByStatus("Available");
      } else if (event.target.value === "In Progress") {
        setSortByStatus("In Progress");
      }
      handleSort(type, event.target.value);
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
          All Uncompleted Tasks
        </Typography>
        <hr />
        <TableContainer sx={{ height: "325px", overflow: "scroll" }}>
          <Table
            stickyHeader
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
                    backgroundColor: "rgb(241, 241, 241)",
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
                    backgroundColor: "rgb(241, 241, 241)",
                  }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgb(241, 241, 241)",
                    width: "33%",
                    fontSize: "2vh",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    fontWeight: "bold",
                  }}
                >
                  Status
                </TableCell>
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
                          {task.status}
                        </TableCell>
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
                          {task.status}
                        </TableCell>
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ width: "100%" }}
          rowsPerPageOptions={[5, 15, 25]}
          component="div"
          count={allApprovedTasks.length}
          rowsPerPage={rowsPerPage1}
          page={page1}
          onPageChange={handleChangePage1}
          onRowsPerPageChange={handleChangeRowsPerPage1}
        />
        <hr />
        {/* <br /> */}
        <Box>
          <Box>
            <FormControl
              sx={{ width: "31.5%", marginLeft: "5px", marginRight: "5px" }}
            >
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
                sx={{}}
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
            <FormControl
              sx={{ width: "31.5%", marginLeft: "5px", marginRight: "5px" }}
            >
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
                sx={{}}
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
            <FormControl
              sx={{ width: "31.5%", marginLeft: "5px", marginRight: "5px" }}
            >
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
                sx={{}}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.status_name}>
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
                Task Details
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
                      Title: {""} {infoOfSpecificTask.title}
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

              <Typography>
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
                        <p style={{ marginRight: "5%" }}></p>
                        <IconButton
                          onClick={openWidget}
                        >
                          <AddAPhotoIcon />
                        </IconButton>
                      </div>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {editedPhotos &&
                        editedPhotos.map((item) => {
                          return <img src={item.photo_url} width={100} />;
                        })}
                        </Box>
                    </>
                  </Box>
                ) : (
                  // if there is no image, there's a big space under location. Might neet to fix that.
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                  </Box>
                )}
              </Typography>
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
                  <Typography
                    variant="h6"
                    component="h4"
                    sx={{ borderBottom: "1px solid grey" }}
                  >
                    Due Date:{" "}
                    {moment(infoOfSpecificTask.due_date).format("MMMM DD YYYY")}
                  </Typography>
                ) : (
                  <>
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
                      onChange={(event, newValue) =>
                        setEditedUserLookup(newValue)
                      }
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
                  ></Box>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ borderBottom: "1px solid grey" }}
                    >
                      Created By: {""}{" "}
                      {infoOfSpecificTask.created_by_first_name}{" "}
                      {infoOfSpecificTask.created_by_last_name}
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
                      multiline
                      rows={4}
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
                {!editMode && (
                  <>
                  <Tooltip title="View comments" placement="left">
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleOpenChild();
                      }}
                      sx={{
                        margin: "3px",
                        width: "20px",
                        maxWidth: "220px",
                        marginTop: "5px",
                        backgroundColor: "rgb(187, 41, 46)",
                        "&:hover": {
                          backgroundColor: "rgb(187, 41, 46)",
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      <CommentIcon />
                    </Button>
                    </Tooltip>
                    <Tooltip title="Edit task" placement="top">
                    <Button
                      variant="contained"
                      onClick={() => setEditMode(!editMode)}
                      sx={{
                        margin: "3px",
                        width: "20px",
                        maxWidth: "220px",
                        marginTop: "5px",
                        backgroundColor: "rgb(187, 41, 46)",
                        "&:hover": {
                          backgroundColor: "rgb(187, 41, 46)",
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      <EditIcon />
                    </Button>
                    </Tooltip>
                    <Tooltip title="Delete task" placement="right">
                    <Button
                      variant="contained"
                      onClick={handleDeny}
                      sx={{
                        margin: "3px",
                        width: "20px",
                        maxWidth: "220px",
                        marginTop: "5px",
                        backgroundColor: "rgb(187, 41, 46)",
                        "&:hover": {
                          backgroundColor: "rgb(187, 41, 46)",
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                    </Tooltip>
                  </>
                )}

                {editMode && (
                  <Tooltip title="Complete edits">
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
                    <CheckIcon />
                  </Button>
                  </Tooltip>
                )}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {!editMode && (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleCompleteTask}
                      sx={{
                        marginRight: "3px",
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
                      Mark Complete
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
                        marginTop: "5px",
                        marginLeft: "3px",
                        backgroundColor: "rgb(187, 41, 46)",
                        "&:hover": {
                          backgroundColor: "rgb(187, 41, 46)",
                          transform: "scale(1.03)",
                        },
                      }}
                    >
                      {infoOfSpecificTask.assigned_to_first_name
                        ? "Drop Task"
                        : "Take Task"}
                    </Button>
                  </>
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
                  {/* <pre>{JSON.stringify(commentsForSpecificTask)}</pre> */}
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
                        <Tooltip title="Add comment">
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
                          <AddIcon />
                        </Button>
                        </Tooltip>
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
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        spacing={3}
      >
        <Paper
          sx={{
            p: 3,
            maxWidth: "35vh",
            width: "90%",
            backgroundColor: "rgb(241, 241, 241)",
          }}
          elevation={3}
        >
          <Typography
            sx={{
              fontSize: "3vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "rgb(187, 41, 46)",
            }}
          >
            Create a New Task
          </Typography>
          <form
            onSubmit={handleSubmitTask}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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

              {/* This just sets up the window.cloudinary widget */}
              {useScript("https://widget.cloudinary.com/v2.0/global/all.js")}
              <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Tooltip title="Add a photo" placement="right">
              <IconButton
                onClick={openWidget}
              >
                <AddAPhotoIcon />
              </IconButton>
              </Tooltip>
              </Box>
            
              <Box sx={{ display: "flex", justifyContent: "center" }}>
              {state &&
                state.map((item) => {
                  return <img src={item.photo_url} width={100} />;
                })}
                </Box>
              
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
                multiline
                rows={4}
              />
              <Tooltip title="Create task" >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "rgb(187, 41, 46)",
                  "&:hover": {
                    backgroundColor: "rgb(187, 41, 46)",
                  },
                  width: 300,
                }}
              >
                <AddIcon />
              </Button>
              </Tooltip>
            </Stack>
          </form>
        </Paper>
      </Stack>
      <Paper
        sx={{
          p: 3,
          maxWidth: "750px",
          width: "90%",
          backgroundColor: "rgb(241, 241, 241)",
        }}
        elevation={3}
      >
        {/* <pre>{JSON.stringify(allCompletedTasks)}</pre> */}
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3vh",
            color: "rgb(187, 41, 46)",
          }}
        >
          All Completed Tasks
        </Typography>
        <hr />

        <TableContainer sx={{ height: "325px", overflow: "scroll" }}>
          <Table
            stickyHeader
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
                    backgroundColor: "rgb(241, 241, 241)",
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
                    backgroundColor: "rgb(241, 241, 241)",
                  }}
                >
                  Completed By
                </TableCell>
                <TableCell
                  sx={{
                    width: "33%",
                    fontSize: "2vh",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    fontWeight: "bold",
                    backgroundColor: "rgb(241, 241, 241)",
                  }}
                >
                  Date Completed
                </TableCell>
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
              <ClearIcon onClick={() => setOpen2(false)} />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "1px solid grey",
                  color: "rgb(187, 41, 46)",
                }}
              >
                Task Details
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
              {photosForTask ? (
                <Typography
                  variant="h6"
                  component="h4"
                  sx={{ borderBottom: "1px solid grey" }}
                >
                  Photos:
                </Typography>
              ) : (
                ""
              )}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
              {photosForTask &&
                photosForTask.map((item) => {
                  return <img src={item.photo_url} width={100} />;
                })}
                </Box>
              <br />
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <Paper
          sx={{
            p: 3,
            backgroundColor: "rgb(241, 241, 241)",
            maxWidth: "300px",
            width: "100%",
            marginBottom: 2,
          }}
          elevation={3}
        >
          <Typography
            variant="h6"
            component="h4"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2.7vh",
              color: "rgb(187, 41, 46)",
            }}
          >
            Manage Tags:
          </Typography>
          <hr />
          <TableContainer sx={{ height: "325px", overflow: "scroll", marginBottom:"15px" }}>
            <Table stickyHeader>
              {/* <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "rgb(241, 241, 241)",
                      width: "40%",
                      fontSize: "1.85vh",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      fontWeight: "bold",
                    }}
                  >
                    
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgb(241, 241, 241)",
                      width: "40%",
                      fontSize: "1.85vh",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      fontWeight: "bold",
                    }}
                  >
                   
                  </TableCell>
                </TableRow>
              </TableHead> */}
              <TableBody>
                {allTags.map((tag) => (
                  <TableRow hover key={tag.id}>
                    <TableCell>{tag.tag_name}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete tag" placement="right">
                        <Button
                          variant="contained"
                          type="button"
                          onClick={() => handleDeleteTag(tag.id)}
                          sx={{
                            width: 75,
                            backgroundColor: "rgb(187, 41, 46)",
                            "&:hover": {
                              backgroundColor: "rgb(187, 41, 46)",
                              transform: "scale(1.03)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
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
                <Tooltip title="Add tag">
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
                    <AddIcon />
                  </Button>
                </Tooltip>
              ),
            }}
          />
        </Paper>
        <Paper
          sx={{
            p: 3,
            backgroundColor: "rgb(241, 241, 241)",
            maxWidth: "300px",
            width: "100%",
            marginBottom: 2,
          }}
          elevation={3}
        >
          <Typography
            variant="h6"
            component="h4"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2.7vh",
              color: "rgb(187, 41, 46)",
            }}
          >
            Manage Locations:
          </Typography>
          <hr />
          <TableContainer sx={{ height: "325px", overflow: "scroll" , marginBottom:"15px"}}>
            <Table stickyHeader>
              {/* <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "rgb(241, 241, 241)",
                      width: "40%",
                      fontSize: "1.85vh",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      fontWeight: "bold",
                    }}
                  >
                    
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgb(241, 241, 241)",
                      width: "40%",
                      fontSize: "1.85vh",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      fontWeight: "bold",
                    }}
                  >
                    
                  </TableCell>
                </TableRow>
              </TableHead> */}
              <TableBody>
                {allLocations.map((location) => (
                  <TableRow hover key={location.id}>
                    <TableCell>{location.location_name}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete locatiion" placement="right">
                        <Button
                          variant="contained"
                          type="button"
                          onClick={() => handleDeleteLocation(location.id)}
                          sx={{
                            width: 75,
                            backgroundColor: "rgb(187, 41, 46)",
                            "&:hover": {
                              backgroundColor: "rgb(187, 41, 46)",
                              transform: "scale(1.03)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
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
                <Tooltip title="Add location">
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
                    <AddIcon />
                  </Button>
                </Tooltip>
              ),
            }}
          />
        </Paper>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </Stack>
  );
}
