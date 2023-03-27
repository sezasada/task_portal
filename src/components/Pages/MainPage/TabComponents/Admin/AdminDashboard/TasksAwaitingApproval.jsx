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
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
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
  }, [editMode, incomingTasks]);

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
      assiged_to_id: editedUserLookup,
    };
    console.log("newObj", newObj);

    dispatch({ type: "SUBMIT_EDITS", payload: newObj });
    setEditMode(!editMode);
    handleClose();
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
    console.log("in widget function");
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
  const handleClose = () => setOpen(false);

  return (
    <Paper sx={{ p: 3 }} elevation={3}>
      {/* <pre>{JSON.stringify(incomingTasks)}</pre> */}
      <Typography>Tasks awaiting approval</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Created At</TableCell>
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
              <TableCell>{task.title}</TableCell>
              <TableCell>
                {task.created_by_first_name} {task.created_by_last_name}
              </TableCell>
              <TableCell>
                {moment(task.time_created).format("MMMM Do YYYY, h:mm a")}
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
            <ClearIcon onClick={() => setOpen(false)}/>
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
                {/* This just sets up the window.cloudinary widget */}

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
              Comments
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                dispatch({
                  type: "MARK_TASK_APPROVED",
                  payload: { task_id: infoOfSpecificTask.task_id },
                });
                handleClose();
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                dispatch({
                  type: "DENY_TASK",
                  payload: infoOfSpecificTask,
                });
                handleClose();
              }}
            >
              Deny
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
          </Paper>
          <Modal
            open={openChild}
            onClose={() => {
              handleCloseChild();
            }}
            sx={{
              overflow:'scroll',
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
                <ClearIcon onClick={() => setOpenChild(false)}/>
                {/* <pre>{JSON.stringify(commentsForTask)}</pre> */}
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ textDecoration: "underline" }}
                >
                  
                </Typography>
                <br />
                
                <TextField
                  type="text"
                  label="Add a comment..."
                  value={comment}
                  multiline rows={2}
                  sx={{
                    "margin-left": "2px",
                    "margin-right": "2px",
                    "padding-left": "2px",
                    "padding-right": "2px",
                    
                  }}
                  onChange={(event) => setComment(event.target.value)}
                  variant="outlined"
                  InputProps={{endAdornment: <Button variant="contained" onClick={handleSubmitComment}>
                  Send
                </Button>}}
                />
                <Box>
                  <List>
                    
                    {commentsForTask.length > 0 &&
                      commentsForTask.map((comment) => (
                        <Card key={comment.comment_id} sx={{
                          margin: "5px",
                          padding: "20px",
                          background: "white",
                        }}>
                         
                          <Box sx={{ fontWeight: 'bold' }}>{comment.posted_by_first_name}</Box><Box sx={{ fontWeight: 'light' }}>{moment(comment.time_posted).format('MMMM d, YYYY h:mma')}</Box>
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
