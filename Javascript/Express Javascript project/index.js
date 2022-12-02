const express = require("express");
const fs = require("fs");
const bicycles = require("./data/data.json");

const app = express();
app.set("view engine", "ejs"); // set to use the ejs template engine
app.use(express.static("public")); // set to use the public folder

app.get("/", (req, res) => {
  res.render("bicycles", {
    bicycles,
  });
  // res.send(bicycles);
});

app.get("/bicycle", (req, res) => {
  const id = req.query.id;
  const bicycle = bicycles.find((b) => b.id === id);
  res.render("overview", { bicycle: bicycle });
  //res.send(bicyle);
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
