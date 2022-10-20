import { useCallback, useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../helpers/getCroppedImg";
import { useSelector } from "react-redux";
import { uploadImages } from "../../functions/UploadImages";
import { updateCoverPicture } from "../../functions/user";
import { sendPost } from "../../functions/posts";
import PulseLoader from "react-spinners/PulseLoader";
import OldCoverPictures from "./OldCoverPictures";

export default function Cover({ cover, visitor, photos }) {
  const { user } = useSelector((state) => ({ ...state }));
  // application state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [coverPicture, setCoverPicture] = useState("");
  const [error, setError] = useState("");
  const [showOldCover, setShowOldCover] = useState(false);

  const menuRef = useRef(null);
  const cRef = useRef(null);
  const refInput = useRef(null);
  const coverRef = useRef(null);
  const [width, setWidth] = useState();

  // set the Width to the size of the cover div each time the window is resized
  useEffect(() => {
    setWidth(coverRef.current.clientWidth);
  }, [window.innerWidth]);

  // close the chowCover menu when you click outside
  useClickOutside(menuRef, () => {
    setShowCoverMenu(false);
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  // const zoomIn = () => {
  //   // slider.current.stepUp();
  //   setZoom(slider.current.value);
  // };
  // const zoomOut = () => {
  //   //slider.current.stepDown();
  //   setZoom(slider.current.value);
  // };
  // event handler function
  const handleImageUpload = (e) => {
    try {
      // console.log("here");
      let file = e.target.files[0];
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/gif" &&
        file.type !== "image/webp" &&
        file.type !== "video/mp4"
      ) {
        setError(`${file.name} format is not supported`);
        //console.log(error);
        // console.log(coverPicture);
        return;
      } else if (file.size > 1024 * 1024 * 5) {
        setError(`${file.name} is too large. max is 5mb`);
        // console.log(error);
        //console.log(coverPicture);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        setCoverPicture(event.target.result);
      };
      //console.log(error);
      // console.log(coverPicture);
    } catch (err) {
      console.log(err);
    }
  };

  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(coverPicture, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setCoverPicture(img);
          //console.log("just show");
        } else {
          //console.log("not show");
          // console.log(img);

          return img;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [croppedAreaPixels]
  );

  const updateCoverPhoto = async () => {
    try {
      setLoading(true);
      let img = await getCroppedImage();
      let blob = await fetch(img).then((b) => b.blob());
      //console.log(blob);
      // console.log(user);
      const path = `${user.username}/cover_pictures`;
      let formData = new FormData();
      formData.append("file", blob);

      formData.append("path", path);
      //console.log(formData);
      const res = await uploadImages(formData, path, user.token);
      // console.log(path);
      const updated_picture = await updateCoverPicture(res[0].url, user.token);
      //console.log(updated_picture);
      if (updated_picture === "ok") {
        const new_post = await sendPost(
          "coverPicture",
          null,
          null,
          res,
          user.id,
          user.token
        );
        if (new_post === "ok") {
          setLoading(false);
          setCoverPicture("");

          cRef.current.src = `${res[0].url}`;
          // update  the picture in the cookie
          // Cookies.set("user", JSON.stringify({ ...user, picture: res[0].url }));
          // update the redux state
          // dispatch({
          //   type: "UPDATEPROFILEPICTURE",
          //   payload: res[0].url,
          // });
        } else {
          setError(new_post);
        }
      } else {
        setError(updated_picture);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  };

  return (
    <div className="profile_cover" ref={coverRef}>
      {coverPicture && (
        <div className="save_changes_cover">
          <div className="save_changes_left">
            <i className="public_icon"></i>
            Your cover photo is public
          </div>
          <div className="save_changes_right">
            <button
              className="blue_btn opacity_btn"
              onClick={() => setCoverPicture("")}
            >
              Cancel
            </button>
            <button className="blue_btn" onClick={() => updateCoverPhoto()}>
              {loading ? <PulseLoader color="#fff" size={5} /> : "Save Changes"}
            </button>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={refInput}
        hidden
        accept="image/jpeg,image/png, image/webp, image/gif"
        onChange={handleImageUpload}
      />

      {error && (
        <div className="postError comment_error">
          <div className="postError_error">{error}</div>
          <button className="blue_btn" onClick={() => setError("")}>
            Try Again
          </button>
        </div>
      )}

      {coverPicture ? (
        <div className="cover_cropper">
          <Cropper
            image={coverPicture}
            crop={crop}
            zoom={zoom}
            aspect={width / 350}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={true}
            objectFit="horizontal-cover"
          />
        </div>
      ) : (
        cover && <img src={cover} className="cover" alt="" ref={cRef} />
      )}
      {!visitor && (
        <div className="update_cover_wrapper">
          <div
            className="open_cover_update"
            onClick={() => {
              setShowCoverMenu((prev) => !prev);
            }}
          >
            <i className="camera_filled_icon"></i>
            Add Cover Photo
          </div>
          {showCoverMenu && (
            <div className="open_cover_menu" ref={menuRef}>
              <div
                className="open_cover_menu_item hover1"
                onClick={() => setShowOldCover(true)}
              >
                <i className="photo_icon"></i>
                Select Photo
              </div>
              <div
                className="open_cover_menu_item hover1"
                onClick={() => refInput.current.click()}
              >
                <i className="upload_icon"></i>
                Upload Photo
              </div>
            </div>
          )}
        </div>
      )}

      {showOldCover && (
        <OldCoverPictures
          photos={photos}
          setCoverPicture={setCoverPicture}
          setShowOldCover={setShowOldCover}
        />
      )}
    </div>
  );
}
