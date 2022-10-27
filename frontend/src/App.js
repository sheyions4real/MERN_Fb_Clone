import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import Activate from "./pages/home/Activate";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useSelector } from "react-redux";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { postReducer } from "./functions/reducers";

function App() {
  // create a react state
  const [visible, setVisible] = useState(false);
  // get the user from the reduc store
  const { user } = useSelector((state) => ({ ...state })); // use the LoggedInRoutes to protect other routes
  // create a redux state object using useReducer and use the  dispatch  to update the state
  const [{ loading, error, posts }, dispatch] = useReducer(postReducer, {
    loading: false,
    posts: [],
    error: "",
  });

  // run the function when the page loads
  useEffect(() => {
    //console.log(user.token);
    getAllPosts();
  }, []);

  // function to get all post
  const getAllPosts = async () => {
    try {
      // set the redux state triggered by this action i.e loading= true and eror = ""
      dispatch({
        type: "POST_REQUEST",
      });

      // call the backend to get all post
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllPosts`,
        // {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // update the redux state with the posts result from the backend
      dispatch({
        type: "POST_SUCCESS",
        payload: data,
      });
      //console.log(data);
      //console.log(posts);
    } catch (error) {
      // use the dispatch to call the POSTS_ERROR which will update the loading and error state to false and the error payload respectively
      dispatch({ type: "POST_ERROR", payload: error?.response?.data.message });
    }
  };
  return (
    <div>
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={posts}
          dispatch={dispatch}
        />
      )}
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/profile"
            element={
              <Profile setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/profile/:username"
            element={
              <Profile setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/home"
            element={
              <Home
                setVisible={setVisible}
                posts={posts}
                getAllPosts={getAllPosts}
              />
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
          <Route
            path="/"
            element={
              <Home
                setVisible={setVisible}
                posts={posts}
                loading={loading}
                getAllPosts={getAllPosts}
              />
            }
            exact
          />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
