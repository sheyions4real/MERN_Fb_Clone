import { useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useClickOutside from "../../helpers/clickOutside";

export default function PostMenu({
  userId,
  postUserId,
  imagesLength,
  setShowPostMenu,
}) {
  const [myPost, setMyPost] = useState(postUserId === userId ? true : false);
  const menu = useRef(null);
  useClickOutside(menu, () => {
    setShowPostMenu(false);
  });
  // console.log(userId);
  // console.log(postUserId);
  return (
    <ul className="post_menu" ref={menu}>
      {myPost && <MenuItem icon="pin_icon" title="Pin Post" />}
      <MenuItem
        icon="save_icon"
        title="Save Post"
        subtitle="Add this to your saved items."
      />{" "}
      <div className="line"></div>
      {!myPost && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn On notification for this Post"
        />
      )}
      {myPost && <MenuItem icon="edit_icon" title="Edit Post" />}
      {imagesLength && <MenuItem icon="download_icon" title="Download" />}
      {imagesLength && <MenuItem icon="fullscreen_icon" title="Fullscreen" />}
      {myPost && (
        <MenuItem img="../../../icons/lock.png" title="Edit Audience" />
      )}
      {myPost && <MenuItem icon="delete_icon" title="Turn off translation" />}
      {myPost && <MenuItem icon="date_icon" title="Edit Date" />}
      {myPost && (
        <MenuItem icon="refresh_icon" title="Refresh share attachment" />
      )}
      {myPost && <MenuItem icon="archive_icon" title="Move to archive" />}
      {myPost && (
        <MenuItem
          icon="trash_icon"
          title="Move to trash"
          subtitle="Items in your trash are deleted after 3 days"
        />
      )}
      {!myPost && (
        <>
          <div className="line"></div>
          <MenuItem
            img="../../../icons/report.png"
            title="Report Post"
            subtitle="I'm concerned about this post"
          />
        </>
      )}
    </ul>
  );
}
