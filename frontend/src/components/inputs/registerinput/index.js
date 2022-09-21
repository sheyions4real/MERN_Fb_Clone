import "./style.css";
import { ErrorMessage, useField } from "formik";
import { useMediaQuery } from "react-responsive"; // for react responsive UI design to taget what view the user is currently

export default function RegisterInput({ type, bottom, ...props }) {
  const [field, meta] = useField(props); // use formik to decompose the field and values in props dynamically
  const miniView = useMediaQuery({
    query: "(min-width: 539px)", // return desktopView as true if the user is in the screen width of 850px
  });
  // const desktopView = useMediaQuery({
  //   query: "(min-width: 850px)", // return desktopView as true if the user is in the screen width of 850px
  // });
  const largeDesktopView = useMediaQuery({
    query: "(min-width: 1170px)", // return desktopView as true if the user is in the screen width of 850px
  });
  //console.log(desktopView);

  const test1 = largeDesktopView && field.name === "first_name";
  const test2 = largeDesktopView && field.name === "last_name";
  return (
    <div className="input_wrap register_input_wrap">
      <input
        className={meta.touched && meta.error ? "inputerror_border" : ""} // when the input is touched and there is an error add the inputerror_border class to the element or "" using the tenary operator
        style={{
          width: `${
            miniView &&
            (field.name === "first_name" || field.name === "last_name") // if its mobileview and the name of the input is first_name of last_name then change the width
              ? "95%"
              : miniView &&
                (field.name === "email" || field.name === "password")
              ? "370px"
              : "300px"
          } `,
        }}
        type={type}
        name={field.type}
        placeholder={field.placeholder}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && (
        <div
          className={
            largeDesktopView ? "input_error input_error_desktop" : "input_error"
          }
          style={{
            transform: "translateY(2px)",
            left: `${test1 ? "-103%" : test2 ? "103%" : ""}`,
          }}
        >
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
          {meta.touched && meta.error && (
            <div
              className={
                largeDesktopView && field.name !== "last_name"
                  ? "error_arrow_left"
                  : largeDesktopView && field.name === "last_name"
                  ? "error_arrow_right"
                  : !largeDesktopView && "error_arrow_bottom"
              }
            ></div>
          )}
        </div>
      )}

      {
        meta.touched && meta.error && (
          <i className="error_icon" style={{ top: "10px" }}></i>
        ) // if its not the bottom then reset the icon top to 63%
      }
    </div>
  );
}
