import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function NotLoggedInRoutes() {
  // check for the user in redux store
  const { user } = useSelector((state) => ({ ...state }));
  //   console.log(user);
  return user ? <Navigate to="/" /> : <Outlet />;
}
