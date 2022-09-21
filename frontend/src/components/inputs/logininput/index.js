import "./style.css";
import { ErrorMessage, useField } from "formik";
import { useMediaQuery } from "react-responsive"; // for react responsive UI design to taget what view the user is currently

export default function LoginInput({ type, bottom, ...props }) {
  const [field, meta] = useField(props); // use formik to decompose the field and values in props dynamically
  const desktopView = useMediaQuery({
    query: "(min-width: 850px)", // return desktopView as true if the user is in the screen width of 850px
  });
  const desktop1050View = useMediaQuery({
    query: "(max-width: 1050px)", // return desktopView as true if the user is in the screen width of 850px
  });
  //console.log(desktopView);

  return (
    <div className="input_wrap">
      {meta.touched && meta.error && !bottom && (
        <div
          className={
            desktopView && desktop1050View && field.name === "conf_password"
              ? "input_error err_res_password"
              : desktopView
              ? "input_error input_error_desktop"
              : "input_error"
          }
        >
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
          {meta.touched && meta.error && (
            <div
              className={desktopView ? "error_arrow_left" : "error_arrow_top"}
            ></div>
          )}
        </div>
      )}
      <input
        className={meta.touched && meta.error ? "inputerror_border" : ""} // when the input is touched and there is an error add the inputerror_border class to the element or "" using the tenary operator
        type={type}
        name={field.type}
        placeholder={field.placeholder}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && bottom && (
        <div
          className={
            desktopView && desktop1050View && field.name === "conf_password"
              ? "input_error conf_password_error"
              : desktopView
              ? "input_error input_error_desktop"
              : "input_error"
          }
        >
          {meta.touched && meta.error && <ErrorMessage name={field.name} />}
          {meta.touched && meta.error && (
            <div
              className={
                desktopView ? "error_arrow_left" : "error_arrow_bottom"
              }
            ></div>
          )}
        </div>
      )}

      {meta.touched && meta.error && (
        <i
          className="error_icon"
          style={{ top: `${!bottom && !desktopView ? "63%" : "11px"}` }}
        ></i> // if its not the bottom then reset the icon top to 63%
      )}
    </div>
  );
}
