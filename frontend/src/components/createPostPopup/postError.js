export default function PostError({ error, setError }) {
  // const { error } = props;

  //console.log("error is " + error);
  return (
    <div className="postError">
      <div>{error}</div>
      <button
        className="blue_btn"
        onClick={() => {
          setError("");
        }}
      >
        Try Again
      </button>
    </div>
  );
}
