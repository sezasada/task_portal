import React from "react";

import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from 'react-redux';

function ResetPassword() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState('');



  useEffect(() => {
    const url = new URL(window.location.href);
    let token = url.href.slice((url.href.indexOf("?") + 1));
    dispatch({type: "CHECK_IF_VALID", payload: {token: token, history: history}});
  }, []);

  const handleChange = (event) => {
    setNewPassword(event.target.value);
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const url = new URL(window.location.href);

    let newObject = {
      newPassword: newPassword,
      token: url.href.slice((url.href.indexOf("?") + 1))
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
