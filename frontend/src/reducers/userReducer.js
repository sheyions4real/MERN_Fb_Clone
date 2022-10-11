import Cookies from "js-cookie";

// get the user from cookie if it exist to initialize the state in the redux store

// userReducer implementation goes here
export function userReducer(
  state = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  action
) {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "UPDATEPROFILEPICTURE":
      return { ...state, picture: action.payload };
    case "VERIFY":
      return { ...state, verified: action.payload };
    case "LOGOUT":
      return null;
    default:
      return state;
  }
}
