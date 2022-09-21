import LoginInput from "../../components/inputs/logininput";

import { Formik, Form } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import DotLoader from "react-spinners/DotLoader"; // see list of loaders in https://www.davidhu.io/react-spinners/
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie"; // use to set cookie
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const loginInfos = {
  email: "",
  password: "",
};

export default function LoginForm({ setVisible }) {
  // we will use this react redux dispatch to dispatch redux reducers actions eg actions in userReducers
  // to store the user model after registration to the redux store
  const dispatch = useDispatch();
  // set the navigator to navigate to other pages
  const navigate = useNavigate();
  const [login, setLogin] = useState(loginInfos);
  const { email, password } = login;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  //console.log(login);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const loginValidation = yup.object().shape({
    email: yup
      .string()
      .required("Email Address is required")
      .email("Must be a valid email")
      .max(26, "Email address is too long"),
    password: yup.string().required("Password is required"),
  });

  const loginSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          email,
          password,
        }
      );

      const { message, ...rest } = data;
      // if login is successful update the store and set cookie
      dispatch({ type: "LOGIN", payload: rest });
      Cookies.set("user", JSON.stringify(rest));
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="login_wrap">
      <div className="login_1">
        <img src="../../icons/facebook.svg" alt="" />
        <p>Facebook helps you connect and share with the people in your life</p>
      </div>
      <div className="login_2">
        <div className="login_2_wrap">
          <Formik
            enableReinitialize
            initialValues={{
              email,
              password,
            }}
            validationSchema={loginValidation}
            onSubmit={() => {
              loginSubmit();
            }}
          >
            {(formik) => (
              <Form>
                <LoginInput
                  type="text"
                  name="email"
                  placeholder="Email address or phone number"
                  onChange={handleLoginChange}
                />
                <LoginInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleLoginChange}
                  bottom
                />
                <button type="submit" className="blue_btn">
                  Log In
                </button>
              </Form>
            )}
          </Formik>
          <DotLoader color="#1876f2" loading={loading} size={40} />
          <Link to="/reset" className="forgot_password">
            Forgotten password?
          </Link>

          {error && <div className="error_text">{error}</div>}
          <div className="sign_splitter"></div>
          <button
            className="blue_btn open_signup"
            onClick={() => setVisible(true)}
          >
            {" "}
            Create Account
          </button>
        </div>

        <Link to="/" className="sign_extra">
          <b>Create a Page</b> for a celebrity, brand or business
        </Link>
      </div>
    </div>
  );
}
