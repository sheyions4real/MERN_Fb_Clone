export default function Bio({
  info,
  max,
  handleChange,
  setShowBio,
  updateDetails,
  placeholder,
  name,
  detail,
  setShow,
  select,
}) {
  return (
    <div className="add_bio_wrap">
      {select ? (
        <select
          className="select_rel"
          name={name}
          id=""
          value={info.relationship}
          onChange={handleChange}
        >
          <option value="Single">Single</option>
          <option value="In a relationship">In a Relationship</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
        </select>
      ) : (
        <textarea
          placeholder={placeholder}
          name={name}
          value={info?.[name]}
          maxLength={detail ? 25 : 100}
          className="textarea_blue details_input"
          onChange={handleChange}
        ></textarea>
      )}
      {!detail && <div className="remaining">{max} characters remaining</div>}

      <div className="flex">
        <div className="flex flex_left">
          <i className="public_icon"></i> Public
        </div>
        <div className="flex flex_right">
          <button
            className="gray_btn"
            onClick={() => (!detail ? setShowBio(false) : setShow(false))}
          >
            Cancel
          </button>
          <button className="blue_btn" onClick={() => updateDetails()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
