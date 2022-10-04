import { useRef } from "react";
import EmojiPickerBackground from "./emojiPickerBackground";

export default function ImagePreview({
  text,
  setText,
  user,
  images,
  setImages,
  setShowPreview,
  setError,
}) {
  const imageInputRef = useRef(null);
  const handleImages = (e) => {
    //console.log(img)
    // get the selected images and add them to the images array
    let files = Array.from(e.target.files); // convert the result to an array
    // console.log(files);
    files.forEach((img) => {
      //console.log(img)
      // check if the selected file is the wrong format then discard
      if (
        img.type !== "image/jpeg" &&
        img.type !== "image/png" &&
        img.type !== "image/webp" &&
        img.type !== "image/gif" &&
        img.type !== "video/mp4"
      ) {
        // return if the select file is not in any of these formats
        setError(
          `${img.name} ${img.type} format is unsupported ! only image and mp4 files are allowed `
        );
        // return a new array after removing this img since the format is not supported
        files = files.filter((item) => item.name !== img.name);
        return;
      } else if (img.size > 1024 * 1024 * 5) {
        setError(`${img.name} size is too large. max 5mb is allowed`);
        // return a new array after removing this img since the format is not supported
        files = files.filter((item) => item.name !== img.name);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (readerEvent) => {
        setImages((images) => [...images, readerEvent.target.result]);
      };
    });
  };

  return (
    <div className=" overflow_a scrollbar">
      <EmojiPickerBackground text={text} setText={setText} user={user} type2 />
      <div className="add_pics_wrap ">
        <input
          type="file"
          accept="image/jpeg,image/png, image/webp, image/gif, video/mp4"
          name=""
          id=""
          ref={imageInputRef}
          multiple
          hidden
          onChange={handleImages}
        />

        {images && images.length ? (
          <div className="add_pics_inside1 p0">
            <div className="preview_actions">
              <button className="hover1">
                <i className="edit_icon"></i>
                Edit
              </button>
              <button
                className="hover1"
                onClick={() => {
                  imageInputRef.current.click();
                }}
              >
                <i className="addPhoto_icon"></i>
                Add Photos/Videos
              </button>
            </div>
            <div
              className="small_white_circle"
              onClick={() => {
                setImages([]);
              }}
            >
              <i className="exit_icon"></i>
            </div>
            <div
              className={
                images.length === 1
                  ? "preview1"
                  : images.length === 2
                  ? "preview2"
                  : images.length === 3
                  ? "preview3"
                  : images.length === 4
                  ? "preview4"
                  : images.length === 5
                  ? "preview5"
                  : images.length % 2 === 0
                  ? "preview6"
                  : "preview6 singular_grid"
              }
            >
              {/* {console.log(images)} */}
              {images.map((image, index) =>
                image.includes("video") ? (
                  <video controls key={index}>
                    <source src={image} type="video/mp4" />
                  </video>
                ) : (
                  <img src={image} alt="" key={index} />
                )
              )}

              {
                // <video width="100%" height="100%" controls key={index}>
                //   <source src={images} type="video/mp4" />
                // </video>
              }
            </div>
          </div>
        ) : (
          <div className="add_pics_inside1">
            <div
              className="small_white_circle"
              onClick={() => {
                setShowPreview(false);
              }}
            >
              <i className="exit_icon"></i>
            </div>
            <div
              className="add_col"
              onClick={() => {
                imageInputRef.current.click();
              }}
            >
              <div className="add_circle">
                <i className="addPhoto_icon"></i>
              </div>
              <span>Add Photo/Videos</span>
              <span>or drag and drop</span>
            </div>
          </div>
        )}

        <div className="add_pics_inside2">
          <div className="add_circle">
            <i className="phone_icon"></i>
          </div>
          <div className="mobile_text">Add photos from your mobile device</div>
          <span className="addPhone_btn">Add</span>
        </div>
      </div>
    </div>
  );
}
