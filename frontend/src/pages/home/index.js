// import "./style.css";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/sendVerification/sendVerification";
import Stories from "../../components/home/stories";
import useClickOutside from "../../helpers/clickOutside";
import "./style.css";
export default function Home() {
  const [visible, setVisible] = useState(false);
  const user = useSelector((user) => ({ ...user }));
  //const { user2 } = useSelector((state) => ({ ...state }));
  // el is define create a reference element to any element passed to it using ref={} in this case reference the carc div
  const el = useRef(null);
  useClickOutside(el, () => {
    setVisible(false);
  });

  return (
    <div className="home">
      <Header />
      <LeftHome user={user.user} />
      <div className="home_middle">
        <Stories />
        {user.user.verified === false && <SendVerification user={user.user} />}
        <CreatePost user={user.user} />
      </div>
      <RightHome user={user.user} />
    </div>
  );
}
