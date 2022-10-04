import "./style.css";
import { useState } from "react";
import axios from "axios";

export default function SendVerification({ user }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  console.log(`${process.env.REACT_APP_BACKEND_URL}/sendVerification`);
  const sendVerificationLink = async () => {
    try {
      const data = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sendVerification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      //console.log(data.message);
      setSuccess(data.message);
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="send_verification">
      <span>
        You account is not verified, verify your account before it gets deleted
        after a month from date created
      </span>
      <a
        onClick={() => {
          sendVerificationLink();
        }}
      >
        click here to resend verification link
      </a>
      {success && <div className="success_text">{success}</div>}
      {error && <div className="error_text">{error}</div>}
    </div>
  );
}
