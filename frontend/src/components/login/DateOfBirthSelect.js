import { useMediaQuery } from "react-responsive"; // for react responsive UI design to taget what view the user is currently

export default function DateOfBirthSelect(props) {
  const {
    bMonth,
    bYear,
    days,
    months,
    years,
    handleRegisterChange,
    dateError,
  } = props;

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
        Date of birth <i className="info_icon"></i>
      </div>
      <div
        className="reg_grid"
        style={{
          marginBottom: `${dateError && !largeDesktopView ? "75px" : "0"}`,
        }}
      >
        <select name="bDay" onChange={handleRegisterChange}>
          {days.map((day, i) => (
            <option value={day} key={i}>
              {day}
            </option>
          ))}
        </select>
        <select name="bMonth" value={bMonth} onChange={handleRegisterChange}>
          {months.map((month, i) => (
            <option value={month} key={i}>
              {month}
            </option>
          ))}
        </select>
        <select name="bYear" value={bYear} onChange={handleRegisterChange}>
          {years.map((year, i) => (
            <option value={year} key={i}>
              {year}
            </option>
          ))}
        </select>
        {dateError && (
          <div
            className={
              !largeDesktopView
                ? "input_error"
                : "input_error input_error_select_large"
            }
            style={{
              marginTop: `${dateError && !largeDesktopView && "5px"}`,
            }}
          >
            <div
              className={
                !largeDesktopView ? "error_arrow_bottom" : "error_arrow_left"
              }
            ></div>
            {dateError}
          </div>
        )}
      </div>
    </div>
  );
}
