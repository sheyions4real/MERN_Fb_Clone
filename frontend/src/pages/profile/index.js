import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import Post from "../../components/post";
import { profileReducer } from "../../functions/reducers";
import Cover from "./Cover";
import Friends from "./Friends";
import GridPosts from "./GridPosts";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import Photos from "./Photos";
import ProfileMenu from "./ProfileMenu";
import ProfilePictureInfos from "./ProfilePictureInfos";
import "./style.css";

export default function Profile({ setVisible }) {
  const [photos, setPhotos] = useState();
  const navigate = useNavigate();
  // get the parameter passed to the route
  const { username } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  //console.log(user.token);
  var userName =
    username === undefined
      ? user.username.toLowerCase()
      : username.toLowerCase();

  // console.log(userName);

  // check for the user and if it dies not exits

  // create a redux state object using useReducer and use the  dispatch  to update the state
  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: [],
    error: "",
  });

  // runs when the page load and when the userName changes
  useEffect(() => {
    // get the user profile
    getProfile();
  }, [userName]);
  //console.log(userName);
  //console.log(user.username);
  var visitor =
    userName.toLowerCase() === user.username.toLowerCase() ? false : true;
  //console.log(visitor);

  const path = `${userName}/*`;
  const max = 30;
  const sort = "desc";
  const getProfile = async () => {
    try {
      // use dispatch to set the loading to true and the error to ""
      dispatch({ type: "PROFILE_REQUEST" });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      //console.log(data);
      // if the profile does not exist navigate to home page
      if (data.ok === false) {
        navigate("/profile");
      } else {
        try {
          // get the user photos
          const images = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/listImages`,
            { path, sort, max },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          console.log("profile images");
          console.log(images);
          setPhotos(images.data);
        } catch (error) {
          console.log(error);
        }
        // use dispatch to update the profile, loading and the error state
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: data,
        });
      }
    } catch (error) {
      // use dispatch to update the profile, loading and the error state
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  //console.log(profile);
  return (
    <div className="profile">
      <Header page="profile" />
      <div className="profile_top">
        <div className="profile_container">
          <Cover
            cover={profile.cover}
            visitor={visitor}
            photos={photos?.resources}
          />
          <ProfilePictureInfos
            profile={profile}
            visitor={visitor}
            photos={photos?.resources}
          />
          <ProfileMenu />
        </div>
      </div>{" "}
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PeopleYouMayKnow />
            <div className="profile_grid">
              <div className="profile_left">
                <Photos
                  username={userName}
                  token={user.token}
                  photos={photos}
                />
                <Friends friends={profile?.friends} />
                <div className="relative_fb_copyright">
                  <Link to="/">Privacy</Link>
                  <span>. </span>
                  <Link to="/">Terms</Link>
                  <span>. </span>
                  <Link to="/">Advertising</Link>
                  <span>. </span>
                  <Link to="/">
                    Ad Choice <i className="ad_choices_icon"></i>
                  </Link>
                  <span>. </span>
                  <Link to="/">Cookies</Link>
                  <span>. </span>
                  <Link to="/">More</Link>
                  <span>. </span> <br />
                  Meta &copy; 2022
                </div>
              </div>
              <div className="profile_right">
                {!visitor && (
                  <CreatePost user={user} profile setVisible={setVisible} />
                )}
                <GridPosts />
                <div className="posts">
                  {profile.posts && profile.posts.length ? (
                    profile.posts.map((post) => (
                      <Post post={post} user={user} key={post._id} profile />
                    ))
                  ) : (
                    <div className="no_posts">No posts available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
