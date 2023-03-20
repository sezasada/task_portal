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
      email: email,
      history: history
    }
    dispatch({type: 'RESET_PASSWORD', payload: newObject})
    //history.push('/email_sent');

  }

  const handleChange = (event) => {
    setEmail(event.target.value);
  }

  return (<>
  <form onSubmit={handleSubmit}>
    <h3>Need a password reset?</h3>
    <p>Enter your email below to request reset.</p>
          <label>
            Email:
            <input type="email" value={email} onChange={handleChange} />
          </label>
          <button type="submit">Send</button>
        </form>
  </>);
}
 export default RequestReset;