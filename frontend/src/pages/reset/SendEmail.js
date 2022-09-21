import axios from "axios";
import { Link } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader";

export default function SendEmail({
  userInfos,
  email,
  error,
  setError,
  setVisible,
  setUserInfos,
  loading,
  setLoading,
}) {
  const sendEmail = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sendResetCodeVerification`,
        {
          email,
        }
      );

      setError("");

      setLoading(false);
      setVisible(2);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      setError(error.response.data.message ?? error.message);
    }
  };

  return (
    <div className="reset_form dynamic_height">
      <div className="reset_form_header">Reset Your Password</div>
      <div className="reset_grid">
        <div className="reset_left">
          <div className="reset_from_text">
            How do you want to receive the code to reset your password
          </div>
          <label htmlFor="email" className="hover1">
            <input type="Radio" name="" id="email" checked readOnly />
            <div className="label_col">
              <span>Send code via email</span>
              <span>{userInfos?.email}</span>
            </div>
          </label>
        </div>
        <div className="reset_right">
          <img src={userInfos?.picture} alt="" />
          <span>{userInfos?.email}</span>
          <span>Facebook User</span>
        </div>
      </div>
      <DotLoader color="#1876f2" loading={loading} size={40} />
      {error && (
        <div className="error_text" style={{ padding: "10px" }}>
          {error}
        </div>
      )}
      <div className="reset_form_btns">
        <Link to="/login" className="gray_btn">
          Not You ?
        </Link>
        <button
          onClick={() => {
            sendEmail();
          }}
          type="submit"
          className="blue_btn"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
