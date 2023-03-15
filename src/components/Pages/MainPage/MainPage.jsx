import React from "react";
import LogOutButton from "../../Shared/LogOutButton/LogOutButton";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
function UserPage() {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.user);
	const unverifiedUsers = useSelector((store) => store.unverifiedUsersReducer);

	useEffect(() => {
		dispatch({ type: "FETCH_UNVERIFIED_USERS" });
	}, []);

	return (
		<div className="container">
			<h2>Welcome, {user.first_name}!</h2>
			<p>Your ID is: {user.id}</p>
			<pre>{JSON.stringify(user)}</pre>
			<pre>{JSON.stringify(unverifiedUsers)}</pre>

			<LogOutButton className="btn" />
		</div>
	);
}

// this allows us to use <App /> in index.js
export default UserPage;
