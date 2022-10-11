import axios from "axios";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { sendPost } from "../../functions/posts";
import { uploadImages } from "../../functions/UploadImages";
import { updateprofilePicture } from "../../functions/user";
import getCroppedImg from "../../helpers/getCroppedImg";
import Cookies from "js-cookie";

export default function UpdateProfilePicture({
  setImage,
  image,
  setError,
  setShowProfileUpdate,
  pRef,
}) {
  // redux state
  const dispatch = useDispatch({});

  // application state object
  const [description, setDescription] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const slider = useRef(null);
  const { user } = useSelector((state) => ({ ...state }));
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const zoomIn = () => {
    slider.current.stepUp();
    setZoom(slider.current.value);
  };
  const zoomOut = () => {
    slider.current.stepDown();
    setZoom(slider.current.value);
  };
  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(image, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setImage(img);
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

  const updateProfielPicture = async () => {
    try {
      setLoading(true);
      let img = await getCroppedImage();
      let blob = await fetch(img).then((b) => b.blob());
      const path = `${user.username}/profile_pictures`;
      let formData = new FormData();
      formData.append("file", blob);
      formData.append("path", path);
      //console.log("form data ready to post");
      const res = await uploadImages(formData, path, user.token);
      //console.log("form data posted");
      const updated_picture = await updateprofilePicture(
        res[0].url,
        user.token
      );
      //console.log(updated_picture);
      if (updated_picture === "ok") {
        const new_post = await sendPost(
          "profilePicture",
          null,
          description,
          res,
          user.id,
          user.token
        );
        if (new_post === "ok") {
          setLoading(false);
          setImage("");
          setShowProfileUpdate(false);
          pRef.current.style.backgroundImage = `url(${res[0].url})`;
          // update  the picture in the cookie
          Cookies.set("user", JSON.stringify({ ...user, picture: res[0].url }));
          // update the redux state
          dispatch({
            type: "UPDATEPROFILEPICTURE",
            payload: res[0].url,
          });
        } else {
          setError(new_post);
        }
      } else {
        setError(updated_picture);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="postBox update_img">
      <div className="box_header">
        <div
          className="small_circle"
          onClick={() => {
            setImage("");
          }}
        >
          <i className="exit_icon"></i>
        </div>
        <span>Update profile picture</span>
      </div>
      <div className="update_image_desc">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea_blue details_input"
        ></textarea>
      </div>

      <div className="update_center">
        <div className="crooper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            cropShape="round"
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
          />
        </div>
        <div className="slider">
          <div className="slider_circle hover1" onClick={() => zoomOut()}>
            <i className="minus_icon"></i>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.2}
            ref={slider}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
          <div className="slider_circle hover1" onClick={() => zoomIn()}>
            <i className="plus_icon"></i>
          </div>
        </div>
      </div>
      <div className="flex_up">
        <div className="gray_btn" onClick={() => getCroppedImage("show")}>
          <i className="crop_icon"></i>Crop photo
        </div>
        <div className="gray_btn">
          <i className="temp_icon"></i>Make Temporary
        </div>
      </div>
      <div className="flex_p_t">
        <i className="public_icon"></i>
        Your profile picture is public
      </div>
      <div className="update_submit_wrap">
        <div className="blue_link" onClick={() => setImage("")}>
          Cancel
        </div>
        <button
          className="blue_btn"
          disabled={loading}
          onClick={() => updateProfielPicture()}
        >
          {loading ? <PulseLoader color="#fff" size={5} /> : "Save"}
        </button>
      </div>
    </div>
  );
}

// import { useCallback, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "../../helpers/getCroppedImg";
// import { uploadImages } from "../../functions/UploadImages";
// import { sendPost } from "../../functions/posts";
// import { updateprofilePicture } from "../../functions/user";

// export default function UpdateProfilePicture({ image, setImage, setError }) {
//   const [description, setDescription] = useState("");
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const slider = useRef(null);
//   // get the user from the state
//   const { user } = useSelector((state) => ({ ...state }));

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     //console.log(croppedArea, croppedAreaPixels);
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const zoomIn = () => {
//     slider.current.stepUp();
//     setZoom(slider.current.value);
//   };
//   const zoomOut = () => {
//     slider.current.stepDown();
//     setZoom(slider.current.value);
//   };

//   const getCroppedImage = useCallback(
//     async (show) => {
//       try {
//         const img = await getCroppedImg(image, croppedAreaPixels);
//         if (show) {
//           setZoom(1);
//           setCrop({ x: 0, y: 0 });
//           console.log(img);
//           setImage(img);
//         } else {
//           return img;
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     [croppedAreaPixels]
//   );

//   // send new cropped image to backend
//   const updateProfilePicture = async () => {
//     try {
//       let img = getCroppedImage();
//       let blob = await fetch(img).then((b) => b.blob());
//       const path = `${user.username}/profile_pictures`;
//       let formData = new FormData();

//       formData.append("file", blob);
//       formData.append("path", path);

//       // send the formdata to the backend
//       // call fundtion to send images to backend and upload image to cloudinary using the path
//       const response = await uploadImages(formData, path, user.token); // returns the array of the url in cloudinary

//       const updated_picture = await updateprofilePicture(
//         response[0].url,
//         user.token
//       );

//       if (updated_picture === "ok") {
//         // Create a new post with the profile picture update
//         const newPost = await sendPost(
//           "profilePicture",
//           null,
//           description,
//           response[0].url,
//           user.id,
//           user.token
//         );
//         if (newPost === "ok") {
//         } else {
//           setError(newPost);
//         }
//       } else {
//         setError(updated_picture);
//       }
//       // console.log(blob);
//     } catch (error) {
//       console.log(error);
//       setError(error);
//     }
//   };
//   return (
//     <div className="postBox update_img">
//       <div className="box_header">
//         <div
//           className="small_circle"
//           onClick={() => {
//             setImage("");
//           }}
//         >
//           <i className="exit_icon"></i>
//         </div>
//         <span>Update Profile Picture</span>
//       </div>

//       <div className="update_image_desc">
//         <textarea
//           placeholder="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           id=""
//           cols="30"
//           rows="10"
//           className="textarea_blue details_input"
//         ></textarea>
//       </div>
//       <div className="update_center">
//         <div className="cropper">
//           <Cropper
//             image={image}
//             crop={crop}
//             zoom={zoom}
//             aspect={1 / 1}
//             cropShape="round"
//             onCropChange={setCrop}
//             onCropComplete={onCropComplete}
//             onZoomChange={setZoom}
//             showGrid={false}
//           />
//         </div>
//         <div className="slider">
//           <div className="slider_circle hover2" onClick={() => zoomOut()}>
//             <i className="minus_icon"></i>
//           </div>
//           <input
//             ref={slider}
//             type="range"
//             name=""
//             id=""
//             min={1}
//             max={3}
//             step={0.2}
//             value={zoom}
//             onChange={(e) => setZoom(e.target.value)}
//           />
//           <div className="slider_circle hover2" onClick={() => zoomIn()}>
//             <i className="plus_icon"></i>
//           </div>
//         </div>
//       </div>
//       <div className="flex_up">
//         <div className="gray_btn" onClick={() => getCroppedImage(true)}>
//           <i className="crop_icon"></i>
//           Crop Photo
//         </div>
//         <div className="gray_btn">
//           <i className="temp_icon"></i>
//           Make Temporary
//         </div>
//       </div>

//       <div className="flex_p_t">
//         <i className="public_icon"></i>
//         Your profile picture is public
//       </div>
//       <div className="update_submit_wrap">
//         <div className="blue_link">Cancel</div>
//         <button className="blue_btn" onClick={() => updateProfilePicture()}>
//           Save
//         </button>
//       </div>
//     </div>
//   );
// }
