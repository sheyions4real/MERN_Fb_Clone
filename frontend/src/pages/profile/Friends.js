import axios from "axios";
import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { photosReducer } from "../../functions/reducers";

export default function Friends({ friends }) {
  // console.log(friends);
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        <div> Friends</div>
        <div className="profile_header_link">See all Friends</div>
      </div>
      {friends && (
        <div className="profile_card_count">
          {friends?.length === 0
            ? ""
            : friends?.length === 1
            ? "1 Friend"
            : `${friends?.length} Friends`}
        </div>
      )}
      <div className="profile_card_grid">
        {friends &&
          friends.length &&
          friends.slice(0, 9).map((friend, index) => (
            <Link to={`/profile/${friend.username}`}>
              <div className="profile_photo_card" key={index}>
                <img src={friend.picture} alt="" />
                <span>
                  {friend.first_name} {friend.last_name}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
