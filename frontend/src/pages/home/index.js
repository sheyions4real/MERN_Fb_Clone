// import "./style.css";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/sendVerification/sendVerification";
import Stories from "../../components/home/stories";
import Post from "../../components/post";
import useClickOutside from "../../helpers/clickOutside";
import "./style.css";
export default function Home({ setVisible, posts, loading, getAllPosts }) {
  const { user } = useSelector((state) => ({ ...state }));
  const middle = useRef(null);
  const [height, setHeight] = useState();
  useEffect(() => {
    setHeight(middle.current.clientHeight);
  }, [loading, height]);
  //const { user2 } = useSelector((state) => ({ ...state }));
  // el is define create a reference element to any element passed to it using ref={} in this case reference the carc div
  const el = useRef(null);
  useClickOutside(el, () => {
    //setVisible(false);
  });

  return (
    <div className="home" style={{ height: `${height - 150}px` }}>
      <Header page="home" getAllPosts={getAllPosts} />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories />
        {user.verified === false && <SendVerification user={user} />}
        <CreatePost user={user} setVisible={setVisible} />
        <div className="posts">
          {posts.length &&
            posts.map((post) => (
              <Post key={post._id} post={post} user={user} />
            ))}
        </div>
      </div>
      <RightHome user={user} />
    </div>
  );
}
