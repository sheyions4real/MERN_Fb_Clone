import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/login";

export default function LoggedInRoutes() {
  const user = useSelector((state) => ({ ...state }));
  //   console.log(user);
  return user.user ? <Outlet /> : <Login />; // Outlet enable you access the Listed Routes define in App.js if there is a user state in the redux store else show the login page
}
