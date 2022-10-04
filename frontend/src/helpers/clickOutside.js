import { useEffect } from "react"; // you cant run react hooks (useEffect) on a normal function you need to start the function name with use... for a hook function

// define a react hook function. This function in the useEffect  will run one time base on the conditions
export default function useClickOutside(ref, func) {
  // this function will run anytime the ref value changes
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        // if the element passed to it is the element clicked then do nothing
        return;
      }
      func(); // run the funtion that was passed ot it
    };
    // add event lister to the document
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
}
