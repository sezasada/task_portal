import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function RequestReset() {
    const history = useHistory();

    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

const handleSubmit = (event) => {
    event.preventDefault();

    let newObject = {
      email: email
    }
    dispatch({type: 'RESET_PASSWORD', payload: newObject})
    history.push('/email_sent');

  }

  const handleChange = (event) => {
    setEmail(event.target.value);
  }

  return (<>
  <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input type="email" value={email} onChange={handleChange} />
          </label>
          <button type="submit">send email to reset password</button>
        </form>
  </>);
}
 export default RequestReset;