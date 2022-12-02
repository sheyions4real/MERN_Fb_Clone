import Cookies from "js-cookie";

// get the user from cookie if it exist to initialize the state in the redux store

// userReducer implementation goes here
export function themeReducer(
  state = Cookies.get("darkTheme")
    ? JSON.parse(Cookies.get("darkTheme"))
    : false,
  action
) {
  switch (action.type) {
    case "DARK":
      return true;
    case "LIGHT":
      return false;
    default:
      return state;
  }
}
