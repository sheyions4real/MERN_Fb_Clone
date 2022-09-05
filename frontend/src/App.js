import { NewRoom } from "./svg";

function App() {
  const get = async () => {
    const response = await fetch("http://localhost:8000");
    console.log(response);
  };

  get();
  return (
    <div>
      welcome to frontend
      <NewRoom color="black" />
    </div>
  );
}

export default App;
