import { useRef } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../../helpers/clickOutside";

export default function OldCoverPictures({
  photos,
  setCoverPicture,
  setShowOldCover,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const ref = useRef(null);
  // click outside
  useClickOutside(ref, () => {
    setShowOldCover(false);
  });
  return (
    <div className="blur">
      <div className="postBox selectCoverBox" ref={ref}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setShowOldCover(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Select Photo</span>
        </div>
        <div className="selectCoverBox_links">
          <div className="selectCoverBox_link">Recent Photos</div>
          <div className="selectCoverBox_link">Photo Album</div>
        </div>

        <div
          className="old_pictures_wrap scrollbar"
          style={{ paddingBottom: "70px" }}
        >
          <h4>Your Profile Pictures</h4>
          <div className="old_pictures">
            {photos &&
              photos
                .filter(
                  (img) => img.folder === `${user.username}/cover_pictures`
                )
                .map((photo, index) => (
                  <img
                    src={photo.secure_url}
                    alt=""
                    key={index}
                    style={{ width: "140px" }}
                    onClick={() => {
                      setCoverPicture(photo.secure_url);
                      setShowOldCover(false);
                    }}
                  />
                ))}
          </div>

          <h4>Other Pictures</h4>
          <div className="old_pictures">
            {photos &&
              photos
                .filter((img) => img.folder !== `${user.username}/post_images`)
                .map((photo, index) => (
                  <img
                    src={photo.secure_url}
                    alt=""
                    key={index}
                    style={{ width: "140px" }}
                    onClick={() => {
                      setCoverPicture(photo.secure_url);
                      setShowOldCover(false);
                    }}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
