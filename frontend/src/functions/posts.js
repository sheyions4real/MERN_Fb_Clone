import axios from "axios";

export const sendPost = async (type, background, text, images, user, token) => {
  try {
    // console.log("send Post Called");
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/createPost`,
      {
        type,
        background,
        text,
        images,
        user,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    //console.log(data);
    return "ok";
  } catch (error) {
    //console.log(error.message);
    return error.response.data.message;
  }
};
