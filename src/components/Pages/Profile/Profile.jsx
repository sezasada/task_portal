import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Profile() {
  const user = useSelector((store) => store.user);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
  const dispatch = useDispatch();

  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setUsername(user.username);
    setPhoneNumber(user.phone_number);
  }, [user]);

  const updateUser = (event) => {
    event.preventDefault();

    dispatch({
      type: "UPDATE_USER",
      payload: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        phone_number: phoneNumber,
      },
    });
  };

  return (
    <div>
      <form className="formPanel" onSubmit={updateUser}>
        <h2>Update Profile</h2>
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
            New Password:
            <input
              type="password"
              name="password"
              value={password}
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
          <input
            className="btn"
            type="submit"
            name="submit"
            value="Update Profile"
          />
        </div>
      </form>
      <form className="formPanel" onSubmit={updateUser}>
        <h2>Change Password</h2>
        <>
          <div>
            <label htmlFor="password">
              New Password:
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>
          <div>
            <label htmlFor="password">
              Confirm Password:
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>
          <div>
            <input
              className="btn"
              type="submit"
              name="submit"
              value="Change Password"
            />
          </div>
        </>
      </form>
    </div>
  );
}

export default Profile;
