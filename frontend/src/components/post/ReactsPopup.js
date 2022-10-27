import React, { useState } from "react";
import { reactPost } from "../../functions/posts";
import { useSelector } from "react-redux";

export default function ReactsPopup({ visible, setVisible, reactHandler }) {
  const reactsArray = [
    { name: "like", image: "../../../reacts/like.gif" },
    { name: "love", image: "../../../reacts/love.gif" },
    { name: "haha", image: "../../../reacts/haha.gif" },
    { name: "wow", image: "../../../reacts/wow.gif" },
    { name: "sad", image: "../../../reacts/sad.gif" },
    { name: "angry", image: "../../../reacts/angry.gif" },
  ];

  // console.log(postId);
  return (
    <>
      {visible && (
        <div
          className="reacts_popup"
          onMouseOver={() => {
            setTimeout(() => {
              setVisible(true);
            }, 500);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setVisible(false);
            }, 500);
          }}
        >
          {reactsArray.map((react, index) => (
            <div
              className="react"
              key={index}
              onClick={() => reactHandler(react.name)}
            >
              <img src={react.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
