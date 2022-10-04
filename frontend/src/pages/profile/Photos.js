import axios from "axios";
import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { photosReducer } from "../../functions/reducers";

export default function Photos({ username, token }) {
  const navigate = useNavigate();

  const { user } = useSelector((state) => ({ ...state }));

  // create a redux state object using useReducer and use the  dispatch  to update the state
  const [{ loading, error, photos }, dispatch] = useReducer(photosReducer, {
    loading: false,
    photo: [],
    error: "",
  });

  // runs when the page load and when the userName changes
  useEffect(() => {
    // get the user profile
    getPhotos();
  }, [username]);
  console.log(username);
  const path = `${username}/*`;
  const max = 30;
  const sort = "desc";

  const getPhotos = async () => {
    try {
      // use dispatch to set the loading to true and the error to ""
      dispatch({ type: "PHOTOS_REQUEST" });
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/listImages`,
        { path, sort, max },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(data);

      // use dispatch to update the profile, loading and the error state
      dispatch({
        type: "PHOTOS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      // use dispatch to update the profile, loading and the error state
      dispatch({
        type: "PHOTOS_ERROR",
        payload: error.response.data.message,
      });
    }
  };
  console.log(photos);
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        <div> Photos</div>
        <div className="profile_header_link">See all Photos</div>
      </div>
      <div className="profile_card_count">
        {photos?.total_count === 0
          ? ""
          : photos?.total_count === 1
          ? "1 Photo"
          : `${photos?.total_count} Photos`}
      </div>
      <div className="profile_card_grid">
        {photos?.resources &&
          photos?.resources.length &&
          photos?.resources.slice(0, 9).map((photo) => (
            <div className="profile_photo_card" key={photo.public_id}>
              <img src={photo.secure_url} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
}
