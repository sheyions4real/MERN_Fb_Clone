const fs = require("fs");

module.exports = async function (req, res, next) {
  try {
    console.log(Object.values(req.files).flat());
    // Object.values(req.files).flat(); // convert the req.files to an array
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).json({ message: "No files selected" });
    }
    let files = Object.values(req.files).flat();
    files.forEach((file) => {
      console.log(file.mimetype);
      // allow only images
      if (
        !(
          file.mimetype === "image/jpeg" ||
          file.mimetype === "image/png" ||
          file.mimetype === "image/gif" ||
          file.mimetype === "image/webp" ||
          file.mimetype === "video/mp4"
        )
      ) {
        removeTemp(file.tempFilePath);
        return res.status(400).json({ message: "Unsupported format" });
      }

      if (file.size > 1024 * 1024 * 5) {
        removeTemp(file.tempFilePath);
        return res.status(400).json({ message: "Filsize exceeds 5mb" });
      }
      console.log("All test passed");
    });
    next();
  } catch (error) {
    console.log(error.message);
    return res?.status(500).json({ message: error.message });
  }
};

const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
