import axios from "axios";

export const updateprofilePicture = async (url, token) => {
  try {
    // console.log("send Post Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updateProfilePicture`,
      {
        url,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    //console.log(data);
    return "ok";
  } catch (error) {
    console.log(error.message);
    return error.response.data.message;
  }
};

export const updateCoverPicture = async (url, token) => {
  try {
    // console.log("Update Cover Picture Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updateCoverPicture`,
      {
        url,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    //console.log(data);
    return "ok";
  } catch (error) {
    console.log(error.message);
    return error.response.data.message;
  }
};
