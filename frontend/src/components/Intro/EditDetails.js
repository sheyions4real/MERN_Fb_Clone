import { useRef } from "react";
import Detail from "./Detail";
import useClickOutside from "../../helpers/clickOutside";

export default function EditDetails({
  details,
  handleChange,
  updateDetails,
  info,
  setVisible,
}) {
  const modal = useRef(null);

  useClickOutside(modal, () => {
    setVisible(false);
  });

  return (
    <div className="blur">
      <div className="postBox infoBox " ref={modal}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setVisible(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Edit Details</span>
        </div>
        <div className="details_wrapper scrollbar">
          <div className="details_col">
            <span>Customize Your Intro</span>
            <span>Details you select will be public</span>
          </div>
          <div className="details_header">Other Name</div>
          <Detail
            value={details?.otherName}
            img="studies"
            placeholder="Add other name"
            name="otherName"
            text="other Name"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
          />

          <div className="details_header">Work</div>
          <Detail
            value={details?.job}
            img="job"
            placeholder="Add a job title"
            name="job"
            text="job"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
          />

          <Detail
            value={details?.workplace}
            img="job"
            placeholder="Add a workplace"
            name="workplace"
            text="workplace"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
          />
          <div className="details_header">Education</div>
          <Detail
            value={details?.highSchool}
            img="studies"
            placeholder="Add a high school"
            name="highSchool"
            text="high school"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
          />

          <Detail
            value={details?.college}
            img="studies"
            placeholder="Add College"
            name="college"
            text="College"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
          />
          <div className="details_header">Current City</div>
          <Detail
            value={details?.currentCity}
            img="home"
            placeholder="Add Current City"
            name="currentCity"
            text="current city"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
          />
          <div className="details_header">Hometown</div>
          <Detail
            value={details?.homeTown}
            img="home"
            placeholder="Add hometown"
            name="homeTown"
            text="Home town"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
          />
          <div className="details_header">Relationship</div>
          <Detail
            value={details?.relationship}
            img="heart"
            placeholder="Add relationship status"
            name="relationship"
            text="relationship"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
            select
          />

          <div className="details_header">Social Media</div>
          <Detail
            value={details?.instagram}
            img="instagram"
            placeholder="Add instagram"
            name="instagram"
            text="instagram"
            handleChange={handleChange}
            updateDetails={updateDetails}
            info={info}
          />
        </div>
      </div>
    </div>
  );
}
