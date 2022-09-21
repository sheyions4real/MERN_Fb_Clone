import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import RegisterInput from "../../components/inputs/registerinput";
import DateOfBirthSelect from "./DateOfBirthSelect";
import GenderSelect from "./GenderSelect";

import DotLoader from "react-spinners/DotLoader"; // see list of loaders in https://www.davidhu.io/react-spinners/
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie"; // use to set cookie
import { useNavigate } from "react-router-dom";

// the RegistrForm Component
export default function RegisterForm({ setVisible }) {
  // we will use this react redux dispatch to dispatch redux reducers actions eg actions in userReducers
  // to store the user model after registration to the redux store
  const dispatch = useDispatch();
  // set the navigator to navigate to other pages
  const navigate = useNavigate();

  const userInfos = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    bYear: new Date().getFullYear(),
    bMonth: new Date().getMonth() + 1,
    bDay: new Date().getDate(),
    gender: "",
  };

  // define state variables and functions using react useState
  const [user, setUser] = useState(userInfos);
  const [dateError, setDateError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    first_name,
    last_name,
    email,
    password,
    bYear,
    bMonth,
    bDay,
    gender,
  } = user;
  const yearTemp = new Date().getFullYear();

  // handle changes on the form
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); // set the user object to the destructured name and value from the e.target
  };

  //console.log(user);
  const years = Array.from(new Array(108), (val, index) => yearTemp - index); // create an array of years with length 108 from current year to 108 years
  //console.log(years);
  const months = Array.from(new Array(12), (val, index) => 1 + index); // generate the months

  // get the days by months
  const getDays = () => {
    return new Date(bYear, bMonth, 0).getDate(); // return the numbers of days in a month
  };

  //console.log(getDays()); get the days for that month
  const days = Array.from(new Array(getDays()), (val, index) => 1 + index);

  // form validations using Yup
  const registerValidation = Yup.object().shape({
    first_name: Yup.string()
      .required("Whats your firstname")
      .min(2, "Firstname must be between 2 and 16 characters ")
      .max(16, "Firstname cant not be more than 16 characters")
      .matches(/^[aA-zZ]+$/, "numbers and special characters are not allowed"),
    last_name: Yup.string()
      .required("Whats your lastname")
      .min(2, "Lastname must be between 2 and 16 characters ")
      .max(16, "Lastname cant not be more than 16 characters")
      .matches(/^[aA-zZ]+$/, "numbers and special characters are not allowed"),
    email: Yup.string()
      .required("You need to provide a email address")
      .email("Email must be a valid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be more than 8 characters ")
      .max(36, "Password cant be more than 36 characters"),
  });

  // submit the registration to backend api
  const registerSumbit = async () => {
    try {
      setLoading(true);
      //console.log(`${process.env.REACT_APP_BACKEND_URL}/register`);

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        {
          first_name,
          last_name,
          email,
          password,
          bYear,
          bMonth,
          bDay,
          gender,
        }
      );
      setError(""); // no error return
      setSuccess(data.message);
      setLoading(false);

      const { message, ...rest } = data; // remove the message and spread the user data into variable rest
      setTimeout(() => {
        // dispatch
        dispatch({ type: "LOGIN", payload: rest }); // call the action login in the userreducer and set the redux user = rest [the new or logined user]
        Cookies.set("user", JSON.stringify(rest)); // set the user cookie object to the rest
        // use react router to navigate to the home page
        navigate("/");
      }, 2000); // run after waiting  2 seconds
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message); // the data.message is from the {message:"error message json"} returned from the backend
    }
  };

  return (
    <div className="blur">
      <div className="register">
        <div className="register_header">
          <i className="exit_icon" onClick={() => setVisible(false)}></i>
          <span>Sign Up</span>
          <span>Registration is quick and easy</span>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            first_name,
            last_name,
            email,
            password,
            bYear,
            bMonth,
            bDay,
            gender,
          }}
          validationSchema={registerValidation}
          onSubmit={() => {
            let current_date = new Date();
            let picked_date = new Date(bYear, bMonth - 1, bDay);
            console.log(picked_date);

            let atleast14Years = new Date(1970 + 17, 0, 1); //01/01/(1987)
            let atmost70Years = new Date(1970 + 70, 0, 1); //01/01/(2040)
            if (current_date - picked_date < atleast14Years) {
              console.log("Underage you are not 14 years");
              setDateError(
                "It looks like you have entered the wrong info. Please make dure that you use your real date of birth"
              );
            } else if (current_date - picked_date > atmost70Years) {
              console.log("Overage you are more than 70 years");
              setDateError(
                "It looks like you have entered the wrong info. Please make dure that you use your real date of birth"
              );
            } else if (gender === "") {
              setDateError("");
              setGenderError(
                "Please select your gender, you can change who can see this later "
              );
            } else {
              // clear the errors and submit the form value to api
              setDateError("");
              setGenderError("");
              registerSumbit();
            }
          }}
        >
          {(formik) => (
            <Form className="register_form">
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="Firstname"
                  name="first_name"
                  onChange={handleRegisterChange}
                ></RegisterInput>
                <RegisterInput
                  type="text"
                  placeholder="Surname"
                  name="last_name"
                  onChange={handleRegisterChange}
                ></RegisterInput>
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="Mobile number or Email Address"
                  name="email"
                  onChange={handleRegisterChange}
                ></RegisterInput>
              </div>
              <div className="reg_line">
                <RegisterInput
                  type="password"
                  placeholder="New Password"
                  name="password"
                  onChange={handleRegisterChange}
                ></RegisterInput>
              </div>

              <DateOfBirthSelect
                bMonth={bMonth}
                bYear={bYear}
                days={days}
                months={months}
                years={years}
                handleRegisterChange={handleRegisterChange}
                dateError={dateError}
              />

              <GenderSelect
                genderError={genderError}
                handleRegisterChange={handleRegisterChange}
              />
              <div className="reg_infos">
                People who use our service may have uploaded your contact
                information to Facebook. Learn more. By clicking Sign Up, you
                agree to our <span>Terms, Privacy Policy</span> and{" "}
                <span> Cookies Policy.</span>
                <br />
                <br />
                <p>
                  {" "}
                  You may receive SMS notifications from us and can opt out at
                  any time.
                </p>
              </div>
              <div className="reg_btn_wrapper">
                <button type="submit" className="blue_btn ">
                  {" "}
                  Create Account
                </button>
              </div>
              <DotLoader color="#1876f2" loading={loading} size={40} />
              {error && <div className="error_text">{error}</div>}
              {success && <div className="success_text">{success}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
