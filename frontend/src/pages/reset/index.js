import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import "./style.css";
import SearchAccount from "./Search";
import SendEmail from "./SendEmail";
import CodeVerfication from "./CodeVerification";
import Footer from "../../components/login/Footer";
import ChangePassword from "./ChangePassword";
export default function Reset() {
  const { user } = useSelector((user) => ({ ...user }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(0);

  const logout = () => {
    dispatch({ type: "LOGOUT" }); // call the LOGOUT userReducer action which clears the user from the store
    //Cookies.remove("user");       // clear the cookie
    Cookies.set("user", ""); // reset the cookie to empty string
    navigate("/login"); // redirect to the login page
  };

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [conf_password, setConfPassword] = useState("");
  const [userInfos, setUserInfos] = useState("");

  return (
    <div className="reset">
      <div className="reset_header">
        <img src="../../../icons/facebook.svg" alt="" />
        {user?.user ? (
          <div className="right_reset">
            <Link to="/profile">
              <img src={user.user.picture} alt="" />
            </Link>
            <button className="blue_btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="right_reset">
            <button className="blue_btn">Login</button>{" "}
          </Link>
        )}
      </div>

      <div className="reset_wrap">
        {visible === 0 && (
          <SearchAccount
            email={email}
            success={success}
            setEmail={setEmail}
            userInfos={userInfos}
            setUserInfos={setUserInfos}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
            visible={visible}
            setVisible={setVisible}
          />
        )}

        {visible === 1 && userInfos && (
          <SendEmail
            userInfos={userInfos}
            email={email}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
            visible={visible}
            setVisible={setVisible}
          />
        )}
        {visible === 2 && (
          <CodeVerfication
            userInfos={userInfos}
            code={code}
            setCode={setCode}
            error={error}
            setError={setError}
            email={email}
            setLoading={setLoading}
            loading={loading}
            setVisible={setVisible}
          />
        )}
        {visible === 3 && (
          <ChangePassword
            password={password}
            conf_password={conf_password}
            setPassword={setPassword}
            setConfPassword={setConfPassword}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
            email={email}
            setLoading={setLoading}
            loading={loading}
            setVisible={setVisible}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
