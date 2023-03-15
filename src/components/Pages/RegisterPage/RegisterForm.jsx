import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function RegisterForm() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const errors = useSelector((store) => store.errors);
	const dispatch = useDispatch();

	const registerUser = (event) => {
		event.preventDefault();

		dispatch({
			type: "REGISTER",
			payload: {
				first_name: firstName,
				last_name: lastName,
				username: username,
				password: password,
				phone_number: phoneNumber,
			},
		});
	}; // end registerUser

	return (
		<form className="formPanel" onSubmit={registerUser}>
			<h2>Register User</h2>
			{errors.registrationMessage && (
				<h3 className="alert" role="alert">
					{errors.registrationMessage}
				</h3>
			)}
			<div>
				<label htmlFor="first-name">
					First Name:
					<input
						type="text"
						name="first-name"
						value={firstName}
						required
						onChange={(event) => setFirstName(event.target.value)}
					/>
				</label>
			</div>
			<div>
				<label htmlFor="last-name">
					Last Name:
					<input
						type="text"
						name="last-name"
						value={lastName}
						required
						onChange={(event) => setLastName(event.target.value)}
					/>
				</label>
			</div>
			<div>
				<label htmlFor="email">
					Email Address:
					<input
						type="text"
						name="email"
						value={username}
						required
						onChange={(event) => setUsername(event.target.value)}
					/>
				</label>
			</div>
			<div>
				<label htmlFor="password">
					Password:
					<input
						type="password"
						name="password"
						value={password}
						required
						onChange={(event) => setPassword(event.target.value)}
					/>
				</label>
			</div>
			<div>
				<label htmlFor="phone-number">
					Phone Number:
					<input
						type="text"
						name="phone-number"
						value={phoneNumber}
						required
						onChange={(event) => setPhoneNumber(event.target.value)}
					/>
				</label>
			</div>
			<div>
				<input className="btn" type="submit" name="submit" value="Register" />
			</div>
		</form>
	);
}

export default RegisterForm;
