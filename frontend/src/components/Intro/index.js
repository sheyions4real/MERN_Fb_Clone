import { useEffect, useState } from "react";
import Bio from "./Bio";
import axios from "axios";
import "./style.css";
import { useSelector } from "react-redux";
import EditDetails from "./EditDetails";

export default function Intro({
  userDetails,
  visitor,
  othername,
  setOthername,
}) {
  //console.log(details);
  const { user } = useSelector((state) => ({ ...state }));

  const [details, setDetails] = useState();
  useEffect(() => {
    setDetails(userDetails);
    setInfo(userDetails);
  }, [userDetails]);
  //setDetails(userDetails);
  //console.log(details);
  // initial
  // initial
  const initial = {
    bio: details?.bio ? details?.bio : " Welcome to my profile",
    otherName: details?.otherName ? details?.otherName : "",
    job: details?.job ? details?.job : "",
    workplace: details?.workplace ? details?.workplace : "",
    highSchool: details?.highSchool ? details?.highSchool : "",
    college: details?.college ? details?.college : "",
    currentCity: details?.currentCity ? details?.currentCity : "",
    homeTown: details?.homeTown ? details?.homeTown : "",
    relationship: details?.relationship ? details?.relationship : "",
    instagram: details?.instagram ? details?.instagram : "",
  };

  const [info, setInfo] = useState(initial);
  //console.log(info);
  const [showBio, setShowBio] = useState(false);
  const [max, setMax] = useState(info?.bio ? 100 - info?.bio.length : 100);
  const [visible, setVisible] = useState(false);

  // call the backend
  const updateDetails = async () => {
    //console.log(info);
    //console.log(`Bearer ${user.token}`);

    try {
      // console.log("updateDetails function");

      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
        {
          info,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // const { data } = await axios.put(
      //   `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
      //   { info },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${user.token}`,
      //     },
      //   }
      // );
      //console.log(data);
      setShowBio(false);
      setDetails(data);
      setOthername(data.otherName);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  // handlechanges for the bio component
  const handleChange = (e) => {
    const { name, value } = e.target; // get the name and value properties of the instance caller  of the funtion
    setInfo({ ...info, [name]: value });
    setMax(100 - e.target.value.length);
    //console.log(info);
  };

  return (
    <div className="profile_card">
      <div className="profile_card_header">Intro</div>
      {details?.bio && !showBio && (
        <div className="details_col">
          <span className="details_text">{details?.bio}</span>
          {!visitor && (
            <button
              className="gray_btn hover1"
              onClick={() => setShowBio(true)}
            >
              Edit Bio
            </button>
          )}
        </div>
      )}
      {!details?.job && !showBio && !visitor && (
        <button className="gray_btn hover1" onClick={() => setShowBio(true)}>
          Add Bio
        </button>
      )}
      {showBio && (
        <Bio
          placeholder="Add Bio"
          name="bio"
          info={info}
          max={max}
          handleChange={handleChange}
          setShowBio={setShowBio}
          updateDetails={updateDetails}
        />
      )}
      {details?.job && details?.workplace ? (
        <div className="details_profile">
          <img src="../../../icons/job.png" alt="" />
          <div>
            {" "}
            works as {details?.job} at <b>{details?.workplace}</b>
          </div>
        </div>
      ) : details?.job && !details?.workplace ? (
        <div className="details_profile">
          <img src="../../../icons/job.png" alt="" />
          works as {details?.job}
        </div>
      ) : (
        details?.workplace &&
        !details?.job && (
          <div className="details_profile">
            <img src="../../../icons/job.png" alt="" />
            works at <b>{details?.workplace}</b>
          </div>
        )
      )}

      {details?.relationship && (
        <div className="details_profile">
          <img src="../../../icons/heart.png" alt="" />
          is <b>{details?.relationship}</b>
        </div>
      )}

      {details?.college && (
        <div className="details_profile">
          <img src="../../../icons/studies.png" alt="" />
          studied at <b>{details?.college}</b>
        </div>
      )}
      {details?.highSchool && (
        <div className="details_profile">
          <img src="../../../icons/studies.png" alt="" />
          studied at <b>{details?.highSchool}</b>
        </div>
      )}

      {details?.currentCity && (
        <div className="details_profile">
          <img src="../../../icons/home.png" alt="" />
          lives in <b>{details?.currentCity}</b>
        </div>
      )}
      {details?.homeTown && (
        <div className="details_profile">
          <img src="../../../icons/home.png" alt="" />
          from <b>{details?.homeTown}</b>
        </div>
      )}

      {details?.instagram && (
        <div className="details_profile">
          <img src="../../../icons/instagram.png" alt="" />
          <a
            href={`https://www.instagram.com/${details?.instagram}`}
            target="_blank"
          >
            {details?.instagram}
          </a>
        </div>
      )}

      {!visitor && (
        <button
          className="gray_btn hover1 w100"
          onClick={() => setVisible(true)}
        >
          Edit Details
        </button>
      )}
      {visible && !visitor && (
        <EditDetails
          details={details}
          handleChange={handleChange}
          updateDetails={updateDetails}
          info={info}
          setVisible={setVisible}
        />
      )}
      {!visitor && (
        <button className="gray_btn hover1 w100">Add Hobbies</button>
      )}
      {!visitor && (
        <button className="gray_btn hover1 w100">Add Feature</button>
      )}
    </div>
  );
}
