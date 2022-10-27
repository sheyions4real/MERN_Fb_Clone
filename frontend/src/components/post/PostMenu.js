import { useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useClickOutside from "../../helpers/clickOutside";
import { deletePost, savePost } from "../../functions/posts";
import { saveAs } from "file-saver";

export default function PostMenu({
  userId,
  postUserId,
  imagesLength,
  setShowPostMenu,
  postId,
  token,
  setCheckSaved,
  checkSaved,
  images,
  postRef,
}) {
  const [myPost, setMyPost] = useState(postUserId === userId ? true : false);
  const menu = useRef(null);

  useClickOutside(menu, () => {
    setShowPostMenu(false);
  });
  // console.log(userId);
  // console.log(postUserId);

  const savePostHandler = async () => {
    savePost(postId, token);
    if (checkSaved) {
      setCheckSaved(false);
    } else {
      setCheckSaved(true);
    }
  };

  const downloadImages = async () => {
    images.map((image) => {
      saveAs(image.url, "images.jpg");
    });
  };

  const deletePostHandler = async () => {
    //console.log(postId);
    //console.log(token);
    const res = await deletePost(postId, token);

    //console.log(res.status);
    if (res.status === "ok") {
      postRef.current.remove();
    }
  };
  return (
    <ul className="post_menu" ref={menu}>
      {myPost && <MenuItem icon="pin_icon" title="Pin Post" />}
      <div onClick={savePostHandler}>
        {!checkSaved ? (
          <MenuItem
            icon="save_icon"
            title="Save Post"
            subtitle="Add this to your saved items."
          />
        ) : (
          <MenuItem
            icon="save_icon"
            title="UnSave Post"
            subtitle="Remove this from your saved items."
          />
        )}
      </div>
      <div className="line"></div>
      {!myPost && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn On notification for this Post"
        />
      )}
      {myPost && <MenuItem icon="edit_icon" title="Edit Post" />}
      {imagesLength && (
        <div className="download_btn" onClick={() => downloadImages()()}>
          <MenuItem icon="download_icon" title="Download" />
        </div>
      )}
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
        <div onClick={() => deletePostHandler()}>
          <MenuItem
            icon="trash_icon"
            title="Move to trash"
            subtitle="Items in your trash are deleted after 3 days"
          />
        </div>
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
