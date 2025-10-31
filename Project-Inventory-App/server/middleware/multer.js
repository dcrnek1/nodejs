const multer = require("multer");
const path = require("path");
const fs = require("fs");

const saveFileToDisk = async (fileBuffer, originalName) => {
  const ext = path.extname(originalName);
  const randomName = `${path.basename(originalName, ext)}-${Date.now()}${ext}`;
  const uploadPath = path.join(
    __dirname,
    "..",
    "static",
    "uploads",
    randomName
  );

  console.log(path.basename(originalName, path.extname(originalName)));

  try {
    await fs.writeFileSync(uploadPath, fileBuffer);
    return `/static/uploads/${randomName}`;
  } catch (error) {
    return error;
  }
};

const deleteFileFromDisk = async (filepath) => {
  //TO-DO
}

const storage = multer.memoryStorage();

// Preventing upload of unsuported fileTypes
const filter = (allowedMimeTypes) => {
  return (req, file, cb) => {
    if (allowedMimeTypes && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error("File type not allowed.");
      err.code = "INVALID_FILE_TYPE";
      err.path = file?.fieldname;
      err.msg = "File type not allowed.";
      cb(err);
    }
  };
};

// Implementation of error handling with files/storage
const upload = (fieldsConfig, allowedMimeTypes) => {
  return (req, res, next) => {
    const fileFilter = filter(allowedMimeTypes);
    const multerUpload = multer({ storage, fileFilter });
    const upload = multerUpload.fields(fieldsConfig);
    upload(req, res, (err) => {
      if (!err) return next();

      if (err.code === "INVALID_FILE_TYPE") {
        return res
          .status(400)
          .json({ error: err, message: `Allowed files: ${allowedMimeTypes}` });
      }

      if (err instanceof multer.MulterError) {
        err.msg = err?.message;
        return res
          .status(400)
          .json({ error: err, message: "Error with uploading file." });
      }

      next();
    });
  };
};

module.exports = { upload, saveFileToDisk };
