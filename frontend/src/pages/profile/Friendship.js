import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  acceptRequest,
  addFriend,
  cancelRequest,
  deleteRequest,
  follow,
  unFollow,
  unFriend,
} from "../../functions/user";
import useClickOutside from "../../helpers/clickOutside";

export default function Friendship({ friendshipp, profileId }) {
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);
  const [friendship, setFriendship] = useState(friendshipp);
  // set the friendship state anytime friendshipp changes
  useEffect(() => {
    setFriendship(friendshipp);
  }, [friendshipp]);

  const menuRef = useRef();
  useClickOutside(menuRef, () => {
    setFriendsMenu(false);

    setRespondMenu(false);
  });

  const { user } = useSelector((state) => ({ ...state }));

  //handle addFriend onClick
  const addFriendHandler = async () => {
    setFriendship({ ...friendship, requestSent: true, following: true });
    // call the add friend function
    await addFriend(profileId, user.token);
  };

  //handle cancelFriend onClick
  const CancelRequestHandler = async () => {
    setFriendship({ ...friendship, following: false, requestSent: false });
    // call the add friend function
    await cancelRequest(profileId, user.token);
  };

  //handle cancelFriend onClick
  const followHandler = async () => {
    setFriendship({ ...friendship, following: true });
    // call the add friend function
    await follow(profileId, user.token);
  };

  //handle cancelFriend onClick
  const unfollowHandler = async () => {
    setFriendship({ ...friendship, following: false });
    // call the add friend function
    await unFollow(profileId, user.token);
  };

  //handle cancelFriend onClick
  const acceptRequestHandler = async () => {
    setFriendship({
      ...friendship,
      following: true,
      requestSent: false,
      requestReceived: false,
      friends: true,
    });
    // call the add friend function
    await acceptRequest(profileId, user.token);
  };

  const unfriendRequestHandler = async () => {
    setFriendship({
      ...friendship,
      following: false,
      requestSent: false,
      requestReceived: false,
      friends: false,
    });
    // call the add friend function
    await unFriend(profileId, user.token);
  };

  const deleteRequestHandler = async () => {
    setFriendship({
      ...friendship,
      following: false,
      requestSent: false,
      requestReceived: false,
      friends: false,
    });
    // call the add friend function
    await deleteRequest(profileId, user.token);
  };

  return (
    <div className="friendship">
      {friendship?.friends ? (
        <div className="friends_menu_wrap">
          <button className="gray_btn" onClick={() => setFriendsMenu(true)}>
            <img src="../../../icons/friends.png" alt="" />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu" ref={menuRef}>
              <div className="open_cover_menu_item  hover1">
                <img src="../../../icons/favoritesOutline.png" alt="" />
                Favorites
              </div>
              <div className="open_cover_menu_item  hover1">
                <img src="../../../icons/editFriends.png" alt="" />
                Edit Friend List
              </div>
              {friendship?.following ? (
                <div
                  className="open_cover_menu_item  hover1"
                  onClick={() => unfollowHandler()}
                >
                  <img src="../../../icons/unfollowOutlined.png" alt="" />
                  Unfollow
                </div>
              ) : (
                <div
                  className="open_cover_menu_item  hover1"
                  onClick={() => followHandler()}
                >
                  <img src="../../../icons/follow.png" alt="" />
                  Follow
                </div>
              )}

              <div
                className="open_cover_menu_item  hover1"
                onClick={() => unfriendRequestHandler()}
              >
                <i className="unfriend_outlined_icon" alt="" />
                Unfriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship?.requestSent &&
        !friendship?.requestReceived && (
          <button className="blue_btn" onClick={() => addFriendHandler()}>
            <img src="../../../icons/addFriend.png" alt="" className="invert" />
            <span>Add Friend</span>
          </button>
        )
      )}

      {friendship?.requestSent ? (
        <button className="blue_btn" onClick={() => CancelRequestHandler()}>
          <img
            src="../../../icons/cancelRequest.png"
            alt=""
            className="invert"
          />
          <span>Cancel Request</span>
        </button>
      ) : (
        friendship?.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(true)}>
              <img src="../../../icons/friends.png" alt="" />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu" ref={menuRef}>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => acceptRequestHandler()}
                >
                  Confirm
                </div>
                <div
                  className="open_cover_menu_item  hover1"
                  onClick={() => deleteRequestHandler()}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      <div className="flex">
        {friendship?.following ? (
          <button className="gray_btn" onClick={() => unfollowHandler()}>
            <img src="../../../icons/follow.png" className="" alt="" />
            Following
          </button>
        ) : (
          <button className="blue_btn" onClick={() => followHandler()}>
            <img src="../../../icons/follow.png" className="invert" alt="" />
            Follow
          </button>
        )}

        <button className={friendship?.friends ? "blue_btn" : "gray_btn"}>
          <img
            src="../../../icons/message.png"
            className={friendship?.friends && "invert"}
            alt=""
          />
          Message
        </button>
      </div>
    </div>
  );
}
