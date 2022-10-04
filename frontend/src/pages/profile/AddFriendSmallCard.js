export default function AddFriendSmallCard({ item }) {
  return (
    <div className="addFriendCard">
      <div className="addFriend_imgsmall">
        <img src={item.profile_picture} alt="" />
        <div className="addFriend_infos">
          <div className="addFriend_name">
            {item.profile_name.length > 11
              ? `${item.profile_name.substring(0, 11)}...`
              : item.profile_name}
          </div>
          <div className="light_blue_btn">
            <img
              src="../../../icons/addFriend.png"
              alt=""
              className="filter_blue"
            />
            Add Friend
          </div>
        </div>
      </div>
    </div>
  );
}
