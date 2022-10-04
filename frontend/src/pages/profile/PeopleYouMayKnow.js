import { Dots } from "../../svg";
import { stories } from "../../data/home";
import AddFriendSmallCard from "./AddFriendSmallCard";
export default function PeopleYouMayKnow() {
  return (
    <div className="people_you_may_know">
      <div className="people_you_may_know_header">
        People You May Know
        <div className="post_header_right ppl_circle hover1">
          {" "}
          <Dots />
        </div>
      </div>
      <div className="people_you_may_know_list">
        {stories.map((story, i) => (
          <AddFriendSmallCard item={story} key={i} />
        ))}
      </div>
    </div>
  );
}
