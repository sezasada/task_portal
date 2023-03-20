import React from "react";

import { useHistory } from "react-router-dom";

function EmailSent() {
  const history = useHistory();

  return (
    <>
     <h3>Check your email</h3>
     <p>Email sent to your inbox to reset your password</p>
     <button
          type="button"
          className="btn btn_sizeSm"
          onClick={() => {
            history.push("/login");
          }}>Go to Login</button>

    </>
  );
}

export default EmailSent;
