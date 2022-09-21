import { Link } from "react-router-dom";
// import { useReducer, useState } from "react";
import { Form, Formik } from "formik";
import LoginInput from "../../components/inputs/logininput";
import * as Yup from "yup";
import axios from "axios";
import DotLoader from "react-spinners/DotLoader"; // see list of loaders in https://www.davidhu.io/react-spinners/

export default function SearchAccount({
  email,
  setEmail,
  error,
  setError,
  success,
  loading,
  setLoading,
  userInfos,
  setUserInfos,
  visible,
  setVisible,
}) {
  // form validation with Yup
  const validateEmail = Yup.object({
    email: Yup.string()
      .required("Email address is required")
      .email("Must be a valid email")
      .max(50, "Email can't be more than 50 character"),
  });
  // handle search for users
  const searchUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/findUser`,
        { email }
      );

      setUserInfos(data);
      // console.log(data);
      setLoading(false);
      setVisible(1);
      setError("");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="reset_form">
      <div className="reset_form_header">Find Your Account</div>
      <div className="reset_form_text">
        Please enter your email address or mobile number to search for your
        account
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          email,
        }}
        validationSchema={validateEmail}
        onSubmit={() => {
          searchUser();
        }}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="text"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email address or phone number"
              className="reset_form_textbox"
            />
            <DotLoader color="#1876f2" loading={loading} size={40} />
            {error && <div className="error_text">{error}</div>}
            {success && <div className="success_text">{success}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Cancel
              </Link>
              <button type="submit" className="blue_btn">
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
