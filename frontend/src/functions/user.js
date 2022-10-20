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

export const addFriend = async (friendId, token) => {
  try {
    // console.log("Update Cover Picture Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/addFriend/${friendId}`,
      {},
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

export const cancelRequest = async (friendId, token) => {
  try {
    // console.log("Update Cover Picture Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/cancelFriendRequest/${friendId}`,
      {},
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

export const follow = async (friendId, token) => {
  try {
    // console.log("Update Cover Picture Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/follow/${friendId}`,
      {},
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

export const unFollow = async (friendId, token) => {
  try {
    // console.log("Update Cover Picture Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/unfollow/${friendId}`,
      {},
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

export const acceptRequest = async (friendId, token) => {
  try {
    // console.log("Update Cover Picture Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/acceptRequest/${friendId}`,
      {},
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

export const unFriend = async (friendId, token) => {
  try {
    // console.log("Update Cover Picture Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/unFriend/${friendId}`,
      {},
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

export const deleteRequest = async (friendId, token) => {
  try {
    // console.log("Update Cover Picture Called");
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/deleteRequest/${friendId}`,
      {},
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
