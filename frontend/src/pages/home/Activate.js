// import "./style.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import useClickOutside from "../../helpers/clickOutside";
import ActivateForm from "./ActivateForm";
import "./style.css";
export default function Activate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((user) => ({ ...user }));

  // el is define create a reference element to any element passed to it using ref={} in this case reference the carc div
  const el = useRef(null);
  useClickOutside(el, () => {
    // setVisible(false);
  });

  // validate the token and set error or success
  // using axios
  // get the token or parameter url
  const { token } = useParams();
  console.log(token);
  // useEffect to run immediately the page loads like iiff function
  useEffect(() => {
    activateAccount();
  });

  const activateAccount = async () => {
    try {
      setLoading(true);
      console.log(`${process.env.REACT_APP_BACKEND_URL}/activate`);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/activate`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${user.user.token}`,
          },
        }
      );
      // console.log(success);
      setSuccess(data.message);
      // update the cookie to verified true once its successful
      Cookies.set("user", JSON.stringify({ ...user, verified: true }));
      // update the redux store and set verified to true
      dispatch({ type: "VERIFY", payload: true });
      // setLoading(false);

      // navigate to the home after 3 sec
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="home">
      {success && (
        <ActivateForm
          type="success"
          header="Account verification succeeded."
          text={success}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account verification failed."
          text={error}
          loading={loading}
        />
      )}
      <Header />
      <LeftHome user={user.user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user.user} />
      </div>
      <RightHome user={user.user} />
    </div>
  );
}
