import { useMediaQuery } from "react-responsive"; // for react responsive UI design to taget what view the user is currently

export default function GenderSelect(props) {
  const { genderError, handleRegisterChange } = props;

  //   const miniView = useMediaQuery({
  //     query: "(min-width: 539px)", // return desktopView as true if the user is in the screen width of 850px
  //   });
  //   const desktopView = useMediaQuery({
  //     query: "(min-width: 850px)", // return desktopView as true if the user is in the screen width of 850px
  //   });
  const largeDesktopView = useMediaQuery({
    query: "(min-width: 1170px)", // return desktopView as true if the user is in the screen width of 850px
  });

  return (
    <div className="reg_col">
      <div className="reg_line_header">
        Gender <i className="info_icon"></i>
      </div>
      <div className="reg_grid">
        <label htmlFor="male">
          Male
          <input
            type="radio"
            name="gender"
            id="male"
            value="male"
            onChange={handleRegisterChange}
          />
        </label>

        <label htmlFor="female">
          Female
          <input
            type="radio"
            name="gender"
            id="female"
            value="female"
            onChange={handleRegisterChange}
          />
        </label>
        <label htmlFor="custom">
          Custom
          <input
            type="radio"
            name="gender"
            id="custom"
            value="custom"
            onChange={handleRegisterChange}
          />
        </label>
      </div>
      {genderError && (
        <div
          className={
            !largeDesktopView
              ? "input_error"
              : "input_error input_error_select_large"
          }
          style={{
            marginLeft: `${genderError && !largeDesktopView ? "0" : "-38px"}`,
            marginTop: `${genderError && !largeDesktopView ? "10px" : "-50px"}`,
          }}
        >
          <div
            className={
              !largeDesktopView ? "error_arrow_bottom" : "error_arrow_left"
            }
          ></div>
          {genderError}
        </div>
      )}
    </div>
  );
}
