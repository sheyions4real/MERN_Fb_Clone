import "./style.css";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // function used to access the redux store
import {
  Friends,
  Gaming,
  HomeActive,
  Logo,
  Market,
  Search,
  Watch,
  Menu,
  Notifications,
  Messenger,
  ArrowDown,
  Home,
} from "../../svg";
import SearchMenu from "./SearchMenu";
import AllMenu from "./AllMenu";
import UserMenu from "./userMenu";
import useClickOutside from "../../helpers/clickOutside";

export default function Header({ page, getAllPosts }) {
  const color = "#65676b";
  const { user } = useSelector((user) => ({ ...user })); // return the user object from the redux store
  //console.log(user);

  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const allMenu = useRef(null);
  useClickOutside(allMenu, () => {
    setShowAllMenu(false);
  });

  const usermenu = useRef(null);
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
  });

  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div
          className="search search1"
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            name="hide_input"
            placeholder="Search facebook"
            id=""
          />
        </div>
      </div>

      {showSearchMenu && (
        <SearchMenu color={color} setShowSearchMenu={setShowSearchMenu} />
      )}

      <div className="header_middle">
        <Link
          to="/"
          className={`middle_icon ${page === "home" ? "active" : "hover1"}`}
          onClick={() => getAllPosts()}
        >
          {page === "home" ? (
            <HomeActive color={color} />
          ) : (
            <Home color={color} />
          )}
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Friends color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Watch color={color} />
          <div className="middle_notification">9+</div>
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Market color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Gaming color={color} />
        </Link>
      </div>
      <div className="header_right">
        <Link
          to="/profile"
          className={`profile_link hover1 ${
            page === "profile" ? "active_link" : ""
          }`}
        >
          <img src={user?.picture} alt="" />
          <span>{user?.first_name}</span>
        </Link>

        <div
          className={`circle_icon hover1 ${showAllMenu && "active_header"}`}
          onClick={() => {
            setShowAllMenu((prev) => !prev);
          }}
          ref={allMenu}
        >
          <Menu />
          {showAllMenu && <AllMenu />}
        </div>

        <div className="circle_icon hover1">
          <Messenger />
        </div>

        <div className="circle_icon hover1">
          <Notifications />
          <div className="right_notification">20</div>
        </div>

        <div
          className={`circle_icon hover1 ${showUserMenu && "active_header"}`}
          ref={usermenu}
        >
          <div
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <ArrowDown />
          </div>
          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
