import axios from "axios";
import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { photosReducer } from "../../functions/reducers";

export default function Friends({ friends }) {
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        <div> Friends</div>
        <div className="profile_header_link">See all Friends</div>
      </div>
      <div className="profile_card_count">
        {friends?.length === 0
          ? ""
          : friends?.length === 1
          ? "1 Photo"
          : `${friends?.length} Photos`}
      </div>
      <div className="profile_card_grid">
        {friends?.resources &&
          friends?.resources.length &&
          friends?.resources.slice(0, 9).map((friend) => (
            <div className="profile_photo_card" key={friend.public_id}>
              <img src={friend.secure_url} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
}
