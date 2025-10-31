const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Call middleware example
// const upload = require('../middleware/multer');
// upload([{name: 'image', maxCount: 1}], ['image/jpeg', 'image/png'])

// Where the file will be uploaded, defining name and extension
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, path.join('static', 'uploads')),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`)
//   },
// })

const saveFileToDisk = (fileBuffer, originalName) => {
  const ext = path.extname(originalName);
  const randomName = `${originalName}-${Date.now()}${ext}`
  const uploadPath = path.join(__dirname, '..', 'static', 'uploads', randomName);

  fs.writeFileSync(uploadPath, fileBuffer);
  return `/static/uploads/${randomName}`;
};


const storage = multer.memoryStorage();

// Preventing upload of unsuported fileTypes
const filter = (allowedMimeTypes) => {
  return (req, file, cb) => {
    if (allowedMimeTypes && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      const err = new Error('File type not allowed');
      err.code = 'INVALID_FILE_TYPE';
      cb(err);
    }
  }
}


// Implementation of error handling with files/storage
const upload = (fieldsConfig, allowedMimeTypes) => {
  return (req, res, next) => {
    const fileFilter = filter(allowedMimeTypes);
    const multerUpload = multer({ storage, fileFilter });
    const upload = multerUpload.fields(fieldsConfig);
    upload(req, res, (err) => {
      if (!err) return next();

      if (err.code === 'INVALID_FILE_TYPE') {
        console.log(err);
        return res.status(400).json({ error: err, message: `Allowed files: ${allowedMimeTypes}` });
      }

      if (err) {
        console.log(err);
        return res.status(400).json({ error: err, message: "Error with uploading file." });
      }

      next();
    })
  }
}
  

module.exports = {upload, saveFileToDisk};