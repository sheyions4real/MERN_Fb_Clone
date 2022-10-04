const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileUpload");
//const useRoutes = require("./routes/user");               // we will dynamically configure the routes in the routes folder usig the file system
const { readdirSync } = require("fs"); // to read all files in a folder
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const app = express();
//****************** */ CONFIGURE APP TO RETURN JSON RESPONSE /**********************//
app.use(express.json());

//****************** */ CONFIGURE CORS /**********************//
// to allow multiple origin
let allowedOrigin = [
  "http://localhost:3000",
  "http://localhost:7000",
  "some other link",
];

function corsOptions(req, res) {
  let temp;
  let option = req.header("Origin");
  if (allowedOrigin.indexOf(option) > -1) {
    temp = {
      origin: true,
      optionSuccessStatus: 200,
    };
  } else {
    temp = {
      origin: "not allowed",
    };
  }
  res(null, temp);
}

// // setting cors to allow  one origin
// const corsOptions = {
//   origin: "http://localhost:3000",
//   useSuccessStatus: 200,
// };

//app.use(cors(corsOptions));                       // this will allow only the origin in the allowedOrigin list
app.use(cors()); // this will allow all origin to connect

// use express-fileupload to manage file upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// defining routes but this can be done dynamically to use routes for the multiple route files in the routes folder
//app.use("/api", useRoutes);

//****************** */ CONFIGURE ROUTES /**********************//
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r))); // to map all the route files in the route folder

//****************** */ CONFIGURE DATABASE /**********************//
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("Error connecting to Mongodb", err));

//****************** */ CONFIGURE PORT /**********************//
const PORT = process.env.PORT || 8000; // get the PORT variable from the .
app.listen(PORT, () => {
  console.log("server is listening...");
});

// configure Cross origin resources Sharing
