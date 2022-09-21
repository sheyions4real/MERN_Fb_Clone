import { ArrowRight, Plus } from "../../../svg";
import "./style.css";
import { useMediaQuery } from "react-responsive";

import { stories } from "../../../data/home";
import Story from "./Story";

export default function Stories() {
  const query1175px = useMediaQuery({ query: "(max-width:1175px)" });
  const query1030px = useMediaQuery({ query: "(max-width:1030px)" });
  const query965px = useMediaQuery({ query: "(max-width:965px)" });
  const query885px = useMediaQuery({ query: "(max-width:885px)" });

  const max = query885px
    ? 5
    : query965px
    ? 4
    : query1030px
    ? 5
    : query1175px
    ? 4
    : stories.length;

  return (
    <div className="stories">
      <div className="create_story_card">
        <img
          src="../../../images/default_pic.png"
          alt=""
          className="create_story_img"
        />
        <div className="plus_story">
          <Plus color="#fff" />
        </div>
        <div className="create_story_text">Create Story</div>
      </div>

      {stories.slice(0, max).map((story, i) => (
        <Story story={story} key={i} />
      ))}

      <div className="white_circle">
        <ArrowRight color="#65676b" />
      </div>
    </div>
  );
}
