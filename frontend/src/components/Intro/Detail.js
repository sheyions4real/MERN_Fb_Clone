import { useState } from "react";
import Bio from "./Bio";

export default function Detail({
  img,
  value,
  placeholder,
  name,
  handleChange,
  updateDetails,
  info,
  text,
  select,
}) {
  const [show, setShow] = useState(false);
  //console.log(name);
  return (
    <div>
      <div className="add_details_flex " onClick={() => setShow(true)}>
        {value ? (
          <div className="info_profile ">
            <img src={`../../../icons/${img}.png`} alt="" />
            {value}
            <i className="edit_icon"></i>
          </div>
        ) : (
          <>
            <i className="rounded_plus_icon"></i>
            <span className="underline">Add {text}</span>
          </>
        )}
      </div>
      {show && (
        <Bio
          placeholder={placeholder}
          name={name}
          handleChange={handleChange}
          updateDetails={updateDetails}
          info={info}
          detail
          setShow={setShow}
          select={select}
        />
      )}
    </div>
  );
}
