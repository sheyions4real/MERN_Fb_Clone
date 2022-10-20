import Picker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./style.css";

export default function EmojiPickerBackgrounds({
  text,
  setText,
  user,
  type2,
  background,
  setBackground,
}) {
  const [picker, setPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const [showBgs, setShowBgs] = useState(false);

  const textRef = useRef(null);
  const backgroundRef = useRef(null);
  // function runs anytime the cursorPosition state changes
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

  const postBackgrounds = [
    "../../../images/postbackgrounds/1.jpg",
    "../../../images/postbackgrounds/2.jpg",
    "../../../images/postbackgrounds/3.jpg",
    "../../../images/postbackgrounds/4.jpg",
    "../../../images/postbackgrounds/5.jpg",
    "../../../images/postbackgrounds/6.jpg",
    "../../../images/postbackgrounds/7.jpg",
    "../../../images/postbackgrounds/8.jpg",
    "../../../images/postbackgrounds/9.jpg",
    // "../../../images/postbackgrounds/10.jpg",
  ];

  // handle the change of the new post background image to index clicked
  const backgroundHandler = (index) => {
    backgroundRef.current.style.backgroundImage = `url(${postBackgrounds[index]})`;
    setBackground(postBackgrounds[index]);
    backgroundRef.current.classList.add("bgHandler");
  };

  const removeBackgroud = () => {
    backgroundRef.current.style.backgroundImage = "";
    setBackground("");
    backgroundRef.current.classList.remove("bgHandler");
  };

  const smallScreen = useMediaQuery({
    query: "(max-width:550px)",
  });
  return (
    <div className={type2 ? "images_input" : ""}>
      <div className={!type2 ? "flex_center" : ""} ref={backgroundRef}>
        <textarea
          ref={textRef}
          maxLength="250"
          value={text}
          placeholder={`Whats on your mind, ${user.first_name}`}
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current.value.length * 0.1 - 30)
                : "0"
            }%`,
          }}
          onChange={(e) => {
            setText(e.target.value);
          }}
          className={`post_input ${type2 ? "input2" : ""} ${
            smallScreen && !background && "l0"
          }`}
        ></textarea>
      </div>

      <div className={!type2 ? "post_emojis_wrap" : ""}>
        {picker && (
          <div
            className={`comment_emoji_picker ${
              type2 ? "movepicker2" : "rlmove"
            }`}
          >
            <Picker
              onEmojiClick={handleEmoji}
              className="emoji_picker_scrollbar"
            />
          </div>
        )}
        {!type2 && (
          <img
            src="../../../icons/colorful.png"
            alt=""
            className="colorful"
            onClick={() => {
              setShowBgs(!showBgs);
            }}
          />
        )}

        {!type2 && showBgs && (
          <div className="post_backgrounds">
            <div
              className="no_bg"
              onClick={() => {
                removeBackgroud();
              }}
            ></div>
            {postBackgrounds.map((bg, index) => (
              <img
                src={bg}
                key={index}
                alt=""
                onClick={() => {
                  backgroundHandler(index);
                }}
              />
            ))}
          </div>
        )}

        <i
          className={`emoji_icon_large ${type2 ? "moveleft" : ""} `}
          onClick={() => {
            setPicker(!picker);
          }}
        ></i>
      </div>
    </div>
  );
}
