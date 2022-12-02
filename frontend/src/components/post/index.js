import "./style.css";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useEffect, useRef, useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { getReacts, reactPost } from "../../functions/posts";
import Comment from "./Comment";

export default function Post({ post, user, profile }) {
  const [visible, setVisible] = useState(false);

  const [showPostMenu, setShowPostMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [check, setCheck] = useState();
  const [total, setTotal] = useState();
  const [comments, setComments] = useState(post?.comments);
  const [count, setCount] = useState(1);
  const [checkSaved, setCheckSaved] = useState();
  // console.log(post._id);
  const postRef = useRef(null); // used to reference this post to be deleted from the delete post menu

  // get the reacts for the post as it loads
  useEffect(() => {
    getPostReacts();
  }, [post]);

  // set the comments when the post loads
  // get the reacts for the post as it loads
  useEffect(() => {
    setComments(post?.comments);
  }, [post]);

  const getPostReacts = async () => {
    const res = await getReacts(post._id, user.token);
    setReacts(res.reacts);
    //console.log(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
    setCheckSaved(res.checkSaved);
  };

  const reactHandler = async (type) => {
    //console.log("immediate");
    //console.log(post._id);
    reactPost(post._id, type, user.token);
    // update the UI
    if (check === type) {
      setCheck();
      // if the same react is clicked then find it in the array and then reduce the total count
      let index = reacts.findIndex((x) => x.react === check);
      if (index !== -1) {
        setReacts([...reacts], (reacts[index].count = --reacts[index].count));
        setTotal((prev) => --prev);
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react === type);
      let index1 = reacts.findIndex((x) => x.react === check);
      if (index !== -1) {
        setReacts([...reacts], (reacts[index].count = ++reacts[index].count));
        setTotal((prev) => ++prev);
      }
      if (index1 !== -1) {
        setReacts([...reacts], (reacts[index].count = --reacts[index].count));
        setTotal((prev) => --prev);
      }
    }
  };
  // return
  return (
    <div
      className="post"
      style={{ width: `${profile && "100%"}` }}
      ref={postRef}
    >
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
          <div className="reacts_count_imgs">
            {reacts &&
              reacts
                .sort((a, b) => {
                  return b.count - a.count;
                })
                .slice(0, 3)
                .map(
                  (react, index) =>
                    react.count > 0 && (
                      <img
                        src={`../../../reacts/${react.react}.svg`}
                        alt=""
                        key={index}
                      />
                    )
                )}
          </div>
          <div className="reacts_count_num">{total > 0 && total}</div>
        </div>
        <div className="to_right">
          <div className="comments_count">{comments?.length} Comments</div>
          <div className="share_count">1 share</div>
        </div>
      </div>

      <div className="post_actions">
        <ReactsPopup
          visible={visible}
          setVisible={setVisible}
          reactHandler={reactHandler}
        />
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
          onClick={() => reactHandler(check ? check : "like")}
        >
          {check ? (
            <img
              src={`../../../reacts/${check}.svg`}
              alt=""
              className="small_react"
            />
          ) : (
            <i className="like_icon" />
          )}

          <span
            style={{
              color: `${
                check === "like"
                  ? "#4267b2"
                  : check === "love"
                  ? "#f63489"
                  : check === "haha"
                  ? "#f7b125"
                  : check === "sad"
                  ? "#f7b125"
                  : check === "wow"
                  ? "#fb7125"
                  : check === "angry"
                  ? "#e4605a"
                  : ""
              }`,
            }}
          >
            {check ? check : "Like"}
          </span>
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
        <CreateComment
          user={user}
          postId={post._id}
          setComments={setComments}
          setCount={setCount}
        />
        {comments &&
          comments
            .sort((a, b) => {
              return new Date(b.commentAt) - new Date(a.commentAt);
            })
            .slice(0, count)
            .map((comment, index) => <Comment comment={comment} key={index} />)}
        {count < comments.length && (
          <div
            className="view_comments"
            onClick={() => setCount((prev) => prev + 3)}
          >
            View more comments
          </div>
        )}
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
          postId={post._id}
          token={user.token}
          checkSaved={checkSaved}
          setCheckSaved={setCheckSaved}
          images={post.images}
          postRef={postRef}
        />
      )}
    </div>
  );
}
