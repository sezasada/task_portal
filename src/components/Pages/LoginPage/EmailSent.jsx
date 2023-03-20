import React from "react";

import { useHistory } from "react-router-dom";

function EmailSent() {
  const history = useHistory();

  return (
    <>
     <h1>Email sent to reset password</h1>
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
