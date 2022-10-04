import React, { useState } from "react";

export default function ReactsPopup({ visible, setVisible }) {
  const reactsArray = [
    { name: "like", image: "../../../reacts/like.gif" },
    { name: "love", image: "../../../reacts/love.gif" },
    { name: "haha", image: "../../../reacts/haha.gif" },
    { name: "wow", image: "../../../reacts/wow.gif" },
    { name: "sad", image: "../../../reacts/sad.gif" },
    { name: "angry", image: "../../../reacts/angry.gif" },
  ];
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
            <div className="react" key={index}>
              <img src={react.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
