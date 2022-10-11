import axios from "axios";
import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { photosReducer } from "../../functions/reducers";

export default function Photos({ username, token, photos }) {
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        <div> Photos</div>
        <div className="profile_header_link">See all Photos</div>
      </div>
      <div className="profile_card_count">
        {photos?.total_count === 0
          ? ""
          : photos?.total_count === 1
          ? "1 Photo"
          : `${photos?.total_count} Photos`}
      </div>
      <div className="profile_card_grid">
        {photos?.resources &&
          photos?.resources.length &&
          photos?.resources.slice(0, 9).map((photo) => (
            <div className="profile_photo_card" key={photo.public_id}>
              <img src={photo.secure_url} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
}
