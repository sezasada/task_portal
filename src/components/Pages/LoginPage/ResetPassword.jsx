import React from "react";

import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";

function ResetPassword() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState('');
  const handleChange = (event) => {
    setNewPassword(event.target.value);
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();

    let newObject = {
      newPassword
    }
    dispatch({type: 'NEW_PASSWORD', payload: newObject})
    history.push("/login");

  }

  return (
    <>
     <form onSubmit={handleSubmit}>
          <label>
            New Password
            <input type="text" value={newPassword} onChange={handleChange} />
          </label>
          <button type="submit">Reset Password</button>
        </form>
    </>
  );
}

export default ResetPassword;
