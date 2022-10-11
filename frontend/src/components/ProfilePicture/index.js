import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../../helpers/clickOutside";
import "./style.css";
import UpdateProfilePicture from "./UpdateProfilePicture";

export default function ProfileUpdate({ setShowProfileUpdate, pRef, photos }) {
  // get the user from the redux store
  const { user } = useSelector((state) => ({ ...state }));

  // application element reference
  const popup = useRef(null);
  const inputRef = useRef(null);

  // application state
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  console.log(photos);
  // helper functions
  useClickOutside(popup, () => {
    setShowProfileUpdate(false);
  });

  // event handler function
  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/gif" &&
      file.type !== "image/webp" &&
      file.type !== "video/mp4"
    ) {
      setError(`${file.name} format is not supported`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large. max is 5mb`);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      setImage(event.target.result);
    };
  };

  //console.log(`${user.username}`);

  return (
    <div className="blur">
      <input
        type="file"
        name=""
        id=""
        ref={inputRef}
        hidden
        onChange={handleImage}
        accept="image/jpeg,image/png, image/webp, image/gif, video/mp4"
      />
      <div
        className="postBox pictureBox"
        ref={popup}
        style={{ minHeight: "50%", overflow: "hidden" }}
      >
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => setShowProfileUpdate(false)}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Update Profile Picture</span>
        </div>
        <div className="update_picture_wrap">
          <div className="update_picture_buttons">
            <button
              className="light_blue_btn"
              onClick={() => {
                inputRef.current.click();
              }}
            >
              <i className="plus_icon filter_blue"></i>
              Upload photo
            </button>
            <button className="gray_btn">
              <i className="frame_icon"></i>
              Add Frame
            </button>
          </div>
        </div>
        {error && (
          <div className="postError comment_error">
            <div className="postError_error">{error}</div>
            <button className="blue_btn" onClick={() => setError("")}>
              Try Again
            </button>
          </div>
        )}

        <div
          className="old_pictures_wrap scrollbar"
          style={{ paddingBottom: "70px" }}
        >
          <h4>Your Profile Pictures</h4>
          <div className="old_pictures">
            {photos &&
              photos
                .filter(
                  (img) => img.folder === `${user.username}/profile_pictures`
                )
                .map((photo, index) => (
                  <img
                    src={photo.secure_url}
                    alt=""
                    key={index}
                    style={{ width: "100px" }}
                    onClick={() => setImage(photo.secure_url)}
                  />
                ))}
          </div>

          <h4>Other Pictures</h4>
          <div className="old_pictures">
            {photos &&
              photos
                .filter(
                  (img) => img.folder !== `${user.username}/profile_pictures`
                )
                .map((photo, index) => (
                  <img
                    src={photo.secure_url}
                    alt=""
                    key={index}
                    style={{ width: "100px" }}
                    onClick={() => setImage(photo.secure_url)}
                  />
                ))}
          </div>
        </div>
      </div>
      {image && (
        <UpdateProfilePicture
          image={image}
          setImage={setImage}
          setError={setError}
          setShowProfileUpdate={setShowProfileUpdate}
          pRef={pRef}
        />
      )}
    </div>
  );
}
