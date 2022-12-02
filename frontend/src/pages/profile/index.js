import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import Intro from "../../components/Intro";
import Post from "../../components/post";
import { profileReducer } from "../../functions/reducers";
import Cover from "./Cover";
import Friends from "./Friends";
import GridPosts from "./GridPosts";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import Photos from "./Photos";
import ProfileMenu from "./ProfileMenu";
import ProfilePictureInfos from "./ProfilePictureInfos";
import { useMediaQuery } from "react-responsive";
import "./style.css";
import CreatePostPopup from "../../components/createPostPopup";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Profile({ getAllPosts }) {
  const [visible, setVisible] = useState(false);
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

  useEffect(() => {
    setOthername(profile?.details?.otherName);
  }, [profile]);
  var visitor =
    userName.toLowerCase() === user.username.toLowerCase() ? false : true;
  //console.log(visitor);
  const [othername, setOthername] = useState("");

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
          // console.log("profile images");
          //console.log(images);
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
  const [scrollHeight, setScrollHeight] = useState();
  const profileTop = useRef(null);
  const [height, setHeight] = useState();
  const leftSide = useRef(null);
  const [leftHeight, setLeftHeight] = useState();

  useEffect(() => {
    setHeight(profileTop.current.clientHeight + 300);
    setLeftHeight(leftSide.current.clientHeight);
    window.addEventListener("scroll", getScroll, { passive: true });
    return () => {
      window.addEventListener("scroll", getScroll, { passive: true });
    };
  }, [loading, scrollHeight]);
  const check901px = useMediaQuery({
    query: "(min-width:901px)",
  });
  const getScroll = () => {
    setScrollHeight(window.pageYOffset);
  };
  //console.log(profile);
  return (
    <div className="profile">
      {/* <Skeleton height="350px" containerClassName="avatar-skeleton" /> */}
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={profile?.posts}
          dispatch={dispatch}
          profile
        />
      )}
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="profile_top" ref={profileTop}>
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
            othername={othername}
          />
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PeopleYouMayKnow />
            <div
              className={`profile_grid ${
                check901px && scrollHeight >= height && leftHeight > 1000
                  ? "scrollFixed showLess"
                  : check901px &&
                    scrollHeight >= height &&
                    leftHeight < 1000 &&
                    "scrollFixed showMore"
              }`}
            >
              <div className="profile_left" ref={leftSide}>
                <Intro
                  userDetails={profile.details}
                  visitor={visitor}
                  othername={othername}
                  setOthername={setOthername}
                />
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
