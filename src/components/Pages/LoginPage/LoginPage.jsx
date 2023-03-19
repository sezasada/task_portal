import React from "react";
import LoginForm from "./LoginForm";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";

function LoginPage() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    let newObject = {
      email: email
    }
    dispatch({type: 'RESET_PASSWORD', payload: newObject})

  }

  const handleChange = (event) => {
    setEmail(event.target.value);
  }

  return (
    <div>
      <LoginForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push("/registration");
          }}
        >
          Register
        </button>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input type="email" value={email} onChange={handleChange} />
          </label>
          <button type="submit">Reset Password</button>
        </form>
      </center>
    </div>
  );
}

export default LoginPage;
