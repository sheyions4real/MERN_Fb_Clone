import { useEffect, useRef, useState } from "react";
import "./style.css";
import Picker from "emoji-picker-react";

export default function CreatePostPopup({ user }) {
  const [text, setText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [picker, setPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();

  // function runs anytime the cursorPosition state changes
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  const textRef = useRef(null);
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
  return (
    <div className="blur">
      <div className="postBox">
        <div className="box_header">
          <div className="small_circle">
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>

        <div className="box_profile">
          <img src={user?.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>

        {!showPreview && (
          <div className="flex_center">
            <textarea
              ref={textRef}
              maxLength="100"
              value={text}
              placeholder={`Whats on your mind, ${user.first_name}`}
              onChange={(e) => {
                setText(e.target.value);
              }}
              className="post_input"
            ></textarea>
          </div>
        )}

        <div className="post_emojis_wrap">
          {picker && (
            <div className="comment_emoji_picker rlmove">
              <Picker
                onEmojiClick={handleEmoji}
                className="emoji_picker_scrollbar"
              />
            </div>
          )}

          <img src="../../../icons/colorful.png" alt="" className="colorful" />
          <i
            className="emoji_icon_large"
            onClick={() => {
              setPicker(!picker);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}
