import "./style.css";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";

export default function Post({ post, user, profile }) {
  const [visible, setVisible] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);

  // return
  return (
    <div className="post" style={{ width: `${profile && "100%"}` }}>
      <div className="post_header">
        <Link
          to={`/profile/${post.user.username}`}
          className="post_header_left"
        >
          <img src={post.user.picture} alt="" />
          <div className="header_col">
            <div className="post_profile_name">
              {post.user.first_name} {post.user.last_name}
              <div className="updated_p">
                {post.type === "profilePicture" &&
                  `updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } profile picture`}
                {post.type === "cover" &&
                  `updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } cover picture`}
              </div>
            </div>
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post.createdAt}
              </Moment>
              <span> &nbsp;</span>
              <Public color="#828387" />
            </div>
          </div>
        </Link>
        <div
          className="post_header_right hover1"
          onClick={() => {
            setShowPostMenu((prev) => !prev);
          }}
        >
          <Dots color="#828387" />
        </div>
      </div>

      {post.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post.background})` }}
        >
          <div className="post_bg_text">{post.text}</div>
        </div>
      ) : post.type === null ? (
        <div className="">
          <div className="post_text">{post.text}</div>
          {post.images && post.images.length > 0 && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                  ? "grid_2"
                  : post.images.length === 3
                  ? "grid_3"
                  : post.images.length === 4
                  ? "grid_4"
                  : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, index) => (
                <img
                  src={image.url}
                  key={index}
                  alt=""
                  className={`img-${index}`}
                />
              ))}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post.images.length - 5}
                </div>
              )}
            </div>
          )}
        </div>
      ) : post.type === "profilePicture" ? (
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            <img src={post.user.cover} alt="" />
          </div>
          <img
            src={post.images[0].url}
            alt=""
            className="post_updated_picture"
          />
        </div>
      ) : (
        <div className="post_cover_wrap">
          <img src={post.images[0].url} alt="" />
        </div>
      )}

      <div className="post_infos">
        <div className="reacts_count">
          <div className="reacts_count_imgs"></div>
          <div className="reacts_count_num"></div>
        </div>
        <div className="to_right">
          <div className="comments_count">13 Comments</div>
          <div className="share_count">1 share</div>
        </div>
      </div>

      <div className="post_actions">
        <ReactsPopup visible={visible} setVisible={setVisible} />
        <div
          className="post_action hover1"
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
          <i className="like_icon"></i>
          <span>Like</span>
        </div>
        <div className="post_action hover1">
          <i className="comment_icon"></i>
          <span>Comment</span>
        </div>
        <div className="post_action hover1">
          <i className="share_icon"></i>
          <span>Share</span>
        </div>
      </div>

      <div className="comments_wrap">
        <div className="comments_order"></div>
        <CreateComment user={user} />
      </div>
      {
        // pass the login in user id and the post user id to compare whose post it is
      }
      {showPostMenu && (
        <PostMenu
          userId={user.id}
          postUserId={post.user._id}
          imagesLength={post?.images?.length}
          setShowPostMenu={setShowPostMenu}
        />
      )}
    </div>
  );
}
