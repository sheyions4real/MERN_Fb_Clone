// create  server with express

const express = require("express");
var bodyParser = require("body-parser");

const router = express.Router();

const app = express();
// middleware
app.use(router);
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json);
// or
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// create new middleware
app.use((req, res, next) => {
  console.log("I am from midleware");
  console.log(req.method);
  console.log(req.protocol);
  console.log(req.get("host"));
  console.log(req.originalUrl);

  next();
});

router.get("/", (req, res, next) => {
  res.send("welcome to home");
});

router.get("/about", (req, res, next) => {
  res.send("welcome to about");
});

app.post("/login", (req, res, next) => {
  res.setHeader("Content-Type", "text/plain");
  res.write("you posted:\n");
  console.log(req.body);
  res.end(JSON.stringify(req.body, null, 2));
});

app.listen(3000, () => console.log("Server is running at port 3000"));
