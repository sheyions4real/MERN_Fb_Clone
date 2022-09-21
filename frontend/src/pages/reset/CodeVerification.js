import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import LoginInput from "../../components/inputs/logininput";
import * as Yup from "yup";
import axios from "axios";
import DotLoader from "react-spinners/DotLoader";
export default function CodeVerfication({
  userInfos,
  code,
  setCode,
  error,
  setError,
  success,
  loading,
  setLoading,
  setVisible,
  email,
}) {
  const validateCode = Yup.object({
    code: Yup.string()
      .required("Code is required")
      .min(5, "Code must be 5 characters")
      .max(5, "Code must be 5 characters"),
  });

  //call the api to verify code
  const verifyCode = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/validateResetCode`,
        { email, code }
      );

      setLoading(false);
      setError("");
      setVisible(3);
    } catch (error) {
      setLoading(false);
      //console.log(error.message);
      setError(error?.response.data?.message);
    }
  };

  return (
    <div className="reset_form">
      <div className="reset_form_header">Code Verification</div>
      <div className="reset_form_text">
        Please enter code that has been sent to your email
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          code,
        }}
        validationSchema={validateCode}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="text"
              name="code"
              onChange={(e) => {
                setCode(e.target.value);
              }}
              placeholder="Code"
            />
            <DotLoader color="#1876f2" loading={loading} size={40} />
            {error && <div className="error_text">{error}</div>}
            {success && <div className="success_text">{success}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Cancel
              </Link>
              <button
                type="submit"
                className="blue_btn"
                onClick={() => {
                  verifyCode();
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
