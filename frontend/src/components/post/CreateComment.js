import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/UploadImages";
import { comment } from "../../functions/posts";
import { ClipLoader } from "react-spinners";
import useClickOutside from "../../helpers/clickOutside";

export default function CreateComment({ user, postId, setComments, setCount }) {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const [commentImage, setCommentImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const textRef = useRef(null);
  const imgInput = useRef(null);
  const emojiRef = useRef(null);

  useClickOutside(emojiRef, () => {
    setPicker(false);
  });

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  const handleEmoji = (e, { emoji }) => {
    //set focus to the textRef
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    // set the cursor position
    setCursorPosition(start.length + emoji.length); // anytime this sets the cursorposition the useEffect function runs
  };

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
      setCommentImage(event.target.result);
    };
  };

  const handleComment = async (e) => {
    // use the e event to track what key was pressed
    if (e.key === "Enter") {
      if (commentImage != "") {
        setLoading(true);
        const img = dataURItoBlob(commentImage);
        // the path on cloudinary where the comment images will be saved
        const path = `${user.username}/post_images/${postId}`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", img);
        // call the backend to upload images to cloudinary and return the url
        const imgComment = await uploadImages(formData, path, user.token);

        // call the comment function  to save the comment
        const comments = await comment(
          postId,
          text,
          imgComment[0].url,
          user.token
        );
        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        // clear the text and the image
        setText("");
        setCommentImage("");
      } else {
        setLoading(true);

        const comments = await comment(postId, text, "", user.token);
        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      }
    }
  };

  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        <img src={user?.picture} alt="" />
        <div className="comment_input_wrap">
          {picker && (
            <div className="comment_emoji_picker" ref={emojiRef}>
              <Picker
                onEmojiClick={handleEmoji}
                className="emoji_picker_scrollbar"
              />
              {/* <Picker
                onEmojiClick={handleEmoji}
                className="emoji_picker_scrollbar"
              /> */}
            </div>
          )}
          <input
            type="file"
            hidden
            ref={imgInput}
            accept="image/jpeg,image/png, image/webp, image/gif, video/mp4"
            onChange={handleImage}
          />
          {error && (
            <div className="postError comment_error">
              <div className="postError_error">{error}</div>
              <button className="blue_btn" onClick={() => setError("")}>
                Try Again
              </button>
            </div>
          )}

          <input
            placeholder="Write a comment..."
            type="text"
            name=""
            id=""
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleComment}
          />
          <div className="comment_circle" style={{ marginTop: "5px" }}>
            <ClipLoader size={20} color="#1876f2" loading={loading} />
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => {
              setPicker((prev) => !prev);
            }}
          >
            <i className="emoji_icon"></i>
          </div>

          <div
            className="comment_circle_icon hover2"
            onClick={() => {
              imgInput.current.click();
            }}
          >
            <i className="camera_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="gif_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage("")}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  );
}
