import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import LoginInput from "../../components/inputs/logininput";
import * as Yup from "yup";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios";

export default function ChangePassword({
  password,
  conf_password,
  setPassword,
  setConfPassword,
  error,
  setError,
  setSuccess,
  success,
  email,
  setLoading,
  loading,
  setVisible,
}) {
  // set navigation
  const navigate = useNavigate();

  const validatePassword = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be more than 8 characters ")
      .max(36, "Password cant be more than 36 characters"),

    conf_password: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password")], "Password must match"),
  });

  const changePassword = async () => {
    try {
      setSuccess("");
      setError("");
      setLoading(true);

      // password already validated by Yup
      // if (password !== conf_password) {
      //   setError("Password do not match");
      //   setLoading(false);
      //   return;
      // }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changePassword`, {
        email,
        password,
      });

      setError("");

      setLoading(false);
      setTimeout(() => {
        setSuccess("Password changed successfully");
      }, 200);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="reset_form" style={{ height: "300px" }}>
      <div className="reset_form_header">Change Password</div>
      <div className="reset_form_text">Please enter a strong password</div>
      <Formik
        enableReinitialize
        initialValues={{
          password,
          conf_password,
        }}
        validationSchema={validatePassword}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="New Password"
            />
            <LoginInput
              type="password"
              name="conf_password"
              onChange={(e) => {
                setConfPassword(e.target.value);
              }}
              placeholder="Confirm new password"
              bottom
            />
            {error && <div className="error_text">{error}</div>}
            {success && <div className="success_text">{success}</div>}
            <DotLoader color="#1876f2" loading={loading} size={40} />
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Cancel
              </Link>
              <button
                type="submit"
                className="blue_btn"
                onClick={() => {
                  changePassword();
                }}
              >
                Continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
