// import { useEffect, useRef, useState } from "react";
// import "./style.css";
// import Picker from "emoji-picker-react";
// import EmojiPickerBackground from "./emojiPickerBackground";
// import AddToYourPost from "./addToYourPost";
// import ImagePreview from "./imagePreview";
// import useClickOutside from "../../helpers/clickOutside";
// import dataURItoBlob from "../../helpers/dataURItoBlob";
// import PulseLoader from "react-spinners/PulseLoader";
// import { sendPost } from "../../functions/posts";
// import { UploadImages } from "../../functions/UploadImages";
// import PostError from "./postError";

// export default function CreatePostPopup({ user, setVisible }) {
//   const [text, setText] = useState("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [images, setImages] = useState("");
//   const [background, setBackground] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const popup = useRef(null);

//   useClickOutside(popup, () => {
//     setVisible(false);
//   });

//   // send post to backend
//   const submitPost = async () => {
//     try {
//       //console.log("I was posted");
//       // save a post with background
//       if (background) {
//         setLoading(true);
//         const response = await sendPost(
//           null,
//           background,
//           text,
//           null,
//           user.id,
//           user.token
//         );
//         setLoading(false);
//         if (response === "ok") {
//           setBackground("");
//           setText("");
//           setVisible(false);
//           //setError("");
//         }else {
//setError(response);
// }
//       } else if (images && images.length) {
//         // save post with images
//         setLoading(true);
//         const postImages = images.map((image, index) => {
//           return dataURItoBlob(image);
//         });
//         const path = `${user.username}/post Images`;
//         // build the formdata to pass to the UploadImages Backend route
//         let formData = new FormData();
//         formData.append("path", path);

//         postImages.forEach((image) => {
//           formData.append("file", image);
//         });
//         // console.log("Upload with Images to cloudinary");
//         const uploadResponse = await UploadImages(formData, path, user.token);
//         console.log(uploadResponse);

//         // console.log(images);
//         //console.log(postImages);
//         const postResponse = await sendPost(
//           null,
//           null,
//           text,
//           uploadResponse,
//           user.id,
//           user.token
//         );
//         setLoading(false);
//
//           setText("");
//           setVisible(false);
//           setImages("");
//           setError("");
//
//       } else if (text) {
//         // save a plain text post
//         setLoading(true);

//         const response = await sendPost(
//           null,
//           null,
//           text,
//           null,
//           user.id,
//           user.token
//         );
//         setLoading(false);
//         if (response === "ok") {
//           setBackground("");
//           setText("");
//           setVisible(false);
//           setError("");
//         } else {
//           setError(response.data.message);
//         }
//       } else {
//         // do nothing
//       }
//     } catch (error) {
//       setLoading(false);
//       setError(error.message);
//       console.log(error.message);
//     }
//   };
//   return (
//     <div className="blur">
//       <div className="postBox" ref={popup}>
//         {error && <PostError error={error} setError={setError} />}
//         <div className="box_header">
//           <div
//             className="small_circle"
//             onClick={() => {
//               setVisible(false);
//             }}
//           >
//             <i className="exit_icon"></i>
//           </div>
//           <span>Create Post</span>
//         </div>

//         <div className="box_profile">
//           <img src={user?.picture} alt="" className="box_profile_img" />
//           <div className="box_col">
//             <div className="box_profile_name">
//               {user.first_name} {user.last_name}
//             </div>
//             <div className="box_privacy">
//               <img src="../../../icons/public.png" alt="" />
//               <span>Public</span>
//               <i className="arrowDown_icon"></i>
//             </div>
//           </div>
//         </div>

//         {!showPreview ? (
//           <>
//             <EmojiPickerBackground
//               text={text}
//               setText={setText}
//               user={user}
//               setBackground={setBackground}
//               background={background}
//             />
//           </>
//         ) : (
//           <ImagePreview
//             text={text}
//             setText={setText}
//             user={user}
//             images={images}
//             setImages={setImages}
//             setShowPreview={setShowPreview}
//             setError={setError}
//           />
//         )}

//         <AddToYourPost setShowPreview={setShowPreview} />

//         <button
//           className="post_submit"
//           onClick={() => {
//             submitPost();
//           }}
//           disabled={loading}
//         >
//           {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import "./style.css";
import Picker from "emoji-picker-react";
import EmojiPickerBackgrounds from "./emojiPickerBackground";
import AddToYourPost from "./addToYourPost";
import ImagePreview from "./imagePreview";
import useClickOutside from "../../helpers/clickOutside";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import PulseLoader from "react-spinners/PulseLoader";
import { sendPost } from "../../functions/posts";
import { uploadImages } from "../../functions/UploadImages";
import PostError from "./postError";
import { useDispatch } from "react-redux";
export default function CreatePostPopup({ user, setVisible }) {
  const dispatch = useDispatch();
  const popup = useRef(null);
  const [text, setText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");
  useClickOutside(popup, () => {
    setVisible(false);
  });
  const postSubmit = async () => {
    if (background) {
      setLoading(true);
      const response = await sendPost(
        null,
        background,
        text,
        null,
        user.id,
        user.token
      );
      setLoading(false);
      if (response === "ok") {
        setBackground("");
        setText("");
        setVisible(false);
      } else {
        setError(response);
      }
    } else if (images && images.length) {
      setLoading(true);
      const postImages = images.map((img) => {
        return dataURItoBlob(img);
      });
      const path = `${user.username}/post_images`;
      let formData = new FormData();
      formData.append("path", path);
      postImages.forEach((image) => {
        formData.append("file", image);
      });
      const response = await uploadImages(formData, path, user.token);

      const res = await sendPost(
        null,
        null,
        text,
        response,
        user.id,
        user.token
      );
      setLoading(false);
      if (res === "ok") {
        setText("");
        setImages("");
        setVisible(false);
      } else {
        setError(res);
      }
    } else if (text) {
      setLoading(true);
      const response = await sendPost(
        null,
        null,
        text,
        null,
        user.id,
        user.token
      );
      setLoading(false);
      if (response === "ok") {
        setBackground("");
        setText("");
        setVisible(false);
      } else {
        setError(response);
      }
    } else {
      console.log("nothing");
    }
  };
  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setVisible(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user.picture} alt="" className="box_profile_img" />
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

        {!showPreview ? (
          <>
            <EmojiPickerBackgrounds
              text={text}
              user={user}
              setText={setText}
              showPreview={showPreview}
              setBackground={setBackground}
              background={background}
            />
          </>
        ) : (
          <ImagePreview
            text={text}
            user={user}
            setText={setText}
            showPreview={showPreview}
            images={images}
            setImages={setImages}
            setShowPreview={setShowPreview}
            setError={setError}
          />
        )}
        <AddToYourPost setShowPreview={setShowPreview} />
        <button
          className="post_submit"
          onClick={() => {
            postSubmit();
          }}
          disabled={loading}
        >
          {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}
