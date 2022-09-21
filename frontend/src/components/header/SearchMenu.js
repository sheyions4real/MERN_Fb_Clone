import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import { Return, Search } from "../../svg";

export default function SearchMenu({ color, setShowSearchMenu }) {
  const menu = useRef(null);
  const input = useRef(null);
  const [searchIconVisible, setSearchIconVisible] = useState(true);

  useClickOutside(menu, () => {
    setShowSearchMenu(false);
  });

  // function to run once atleast when the component loads
  // set the focus immediately the SearchMenu renders
  useEffect(() => {
    input.current.focus();
  }, []);

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
            onFocus={() => {
              setSearchIconVisible(false);
            }}
            onBlur={() => {
              setSearchIconVisible(true);
            }}
          />
        </div>
      </div>
      <div className="search_history_header">
        <span>Recent searches</span>
        <a>Edit</a>
      </div>
      <div className="search_history"></div>
    </div>
  );
}
