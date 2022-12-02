import { useEffect, useRef, useState } from "react";
import {
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  search,
} from "../../functions/user";
import useClickOutside from "../../helpers/clickOutside";
import { Return, Search } from "../../svg";
import { Link } from "react-router-dom";

export default function SearchMenu({ color, setShowSearchMenu, token }) {
  const [searchIconVisible, setSearchIconVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const menu = useRef(null);
  const input = useRef(null);

  useClickOutside(menu, () => {
    setShowSearchMenu(false);
  });
  useEffect(() => {
    getHistory();
  }, []);
  // function to run once atleast when the component loads
  // set the focus immediately the SearchMenu renders
  const getHistory = async () => {
    const res = await getSearchHistory(token);
    setSearchHistory(res);
    console.log("serach history");
    console.log(res);
  };
  useEffect(() => {
    input.current.focus();
    getHistory(); // update the list
  }, []);

  const searchHandler = async () => {
    // console.log("searchHandler fired");
    if (searchTerm === "") {
      setResults("");
    } else {
      //console.log("search is not empty");
      const res = await search(searchTerm, token);
      //console.log(res);
      setResults(res);
    }
  };

  const addToSearchHistoryHandler = async (searchUser) => {
    const response = await addToSearchHistory(searchUser, token);
    getHistory();
  };

  const removeFromHistoryHandler = async (searchUser) => {
    //console.log("removed saved search");
    removeFromSearch(searchUser, token);
    getHistory(); // update the list
  };

  return (
    <div className="header_left search_area scrollbar" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => {
              setShowSearchMenu(false);
            }}
          >
            <Return color={color} />
          </div>
        </div>
        <div
          className="search"
          onClick={() => {
            input.current.focus();
          }}
        >
          {searchIconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}

          <input
            type="text"
            name=""
            id=""
            placeholder="Search Facebook"
            ref={input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={searchHandler}
            onFocus={() => {
              setSearchIconVisible(false);
            }}
            onBlur={() => {
              setSearchIconVisible(true);
            }}
          />
        </div>
      </div>
      {results == "" && (
        <div className="search_history_header">
          <span>Recent searches</span>
          <a>Edit</a>
        </div>
      )}
      <div className="search_history scrollbar">
        {searchHistory &&
          results == "" &&
          searchHistory
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((user) => (
              <div className="search_user_item hover1" key={user.user._id}>
                <Link
                  className="flex"
                  to={`/profile/${user.user.username}`}
                  onClick={() => addToSearchHistoryHandler(user.user._id)}
                >
                  <img src={user.user.picture} alt="" />
                  <span>
                    {user.user.first_name} {user.user.last_name}
                  </span>
                </Link>
                <i
                  className="exit_icon"
                  onClick={() => {
                    removeFromHistoryHandler(user.user._id);
                  }}
                ></i>
              </div>
            ))}
      </div>
      <div className="search_results scrollbar">
        {results &&
          results.map((user, index) => (
            <Link
              to={`/profile/${user.username}`}
              className="search_user_item"
              key={index}
              onClick={() => addToSearchHistoryHandler(user._id)}
            >
              <img src={user.picture} alt="" />
              <span>
                {user.first_name} {user.last_name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
