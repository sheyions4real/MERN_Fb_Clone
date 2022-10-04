const cloudinary = require("cloudinary");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.uploadImages = async (req, res) => {
  try {
    const { path } = req.body;
    let files = Object.values(req.files).flat();
    let images = [];
    console.log("ready to upload to cloudinary");
    for (const file of files) {
      const url = await uploadToCloudinary(file, path, res);
      console.log(url);
      images.push(url);
      removeTemp(file.tempFilePath); // remove the file after uploaded
    }
    //console.log(images);
    res.json(images);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.listImages = async (req, res) => {
  const { path, sort, max } = req.body;
  console.log(`${path}`);
  cloudinary.v2.search
    .expression(`${path}`)
    .sort_by("created_at", `${sort}`)
    .max_results(max)
    .execute()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.error);
      return res.status(500).json({ message: err });
    });
};

const uploadToCloudinary = async (file, path, response) => {
  try {
    // use promise to handle the await before the forloop even though there is await is actually dont await
    return new Promise((resolve) => {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: path },
        (err, res) => {
          if (err) {
            removeTemp(file.tempFilePath);
            console.log(err.message);
            return (
              res?.status(400).json({ message: "Upload Image Failed" }) ??
              response.status(400).json({ message: err.message })
            );
          }
          resolve({
            url: res.secure_url,
          }); // secure_url is the url of the image in the cloud. this is one of the properties returned
        }
      );
    });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
};

const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

// const cloudinary = require("cloudinary");
// const fs = require("fs");
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });
// exports.uploadImages = async (req, res) => {
//   try {
//     const { path } = req.body;
//     let files = Object.values(req.files).flat();
//     let images = [];
//     for (const file of files) {
//       const url = await uploadToCloudinary(file, path);
//       images.push(url);
//       removeTmp(file.tempFilePath);
//     }
//     res.json(images);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const uploadToCloudinary = async (file, path) => {
//   return new Promise((resolve) => {
//     cloudinary.v2.uploader.upload(
//       file.tempFilePath,
//       {
//         folder: path,
//       },
//       (err, res) => {
//         if (err) {
//           removeTmp(file.tempFilePath);
//           return res.status(400).json({ message: "Upload image failed." });
//         }
//         resolve({
//           url: res.secure_url,
//         });
//       }
//     );
//   });
// };

// const removeTmp = (path) => {
//   fs.unlink(path, (err) => {
//     if (err) throw err;
//   });
// };
