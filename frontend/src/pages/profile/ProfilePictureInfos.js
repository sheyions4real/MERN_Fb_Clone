import { useRef, useState } from "react";
import ProfileUpdate from "../../components/ProfilePicture";

export default function ProfilePictureInfos({ profile, visitor, photos }) {
  const [showProfileUpdate, setShowProfileUpdate] = useState(false);
  const pRef = useRef(null);
  console.log(photos);
  return (
    <div className="profile_img_wrap">
      {showProfileUpdate && (
        <ProfileUpdate
          setShowProfileUpdate={setShowProfileUpdate}
          pRef={pRef}
          photos={photos}
        />
      )}
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            ref={pRef}
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${profile?.picture})`,
            }}
          ></div>
          {!visitor && (
            <div
              className="profile_circle hover1"
              onClick={() => setShowProfileUpdate(true)}
            >
              <i className="camera_filled_icon"></i>
            </div>
          )}
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
            {profile?.first_name} {profile?.last_name}{" "}
            <div className="othername">(Othername)</div>
          </div>
          <div className="profile_friend_count"></div>
          <div className="profile_friend_imgs"></div>
        </div>
      </div>
      {visitor ? (
        ""
      ) : (
        <div className="profile_w_right">
          <div className="blue_btn">
            <img src="../../../icons/plus.png" alt="" className="invert" />
            <span>Add to story</span>
          </div>
          <div className="gray_btn">
            <i className="edit_icon"></i>
            <span>Edit profile</span>
          </div>
        </div>
      )}
    </div>
  );
}
