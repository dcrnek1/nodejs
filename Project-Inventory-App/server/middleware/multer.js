const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

async function compressImage(fileBuffer, mimetype) {
  // Auto convert everything to JPEG or WebP (best size savings)
  return sharp(fileBuffer)
    .resize(500, null, { fit: "inside" }) // maintain aspect ratio
    .jpeg({
      quality: 60, // compress heavily
      chromaSubsampling: "4:2:0", // smaller color data
      mozjpeg: true, // best JPEG optimizer
    })
    .toBuffer();
}

const saveFileToDisk = async (
  fileBuffer,
  originalName,
  filePath = ["static", "uploads"],
) => {
  const ext = path.extname(originalName);
  const randomName = `${path.basename(originalName, ext)}-${Date.now()}${ext}`;

  const uploadPath = path.join(__dirname, "..", ...filePath, randomName);

  try {
    await fs.promises.writeFile(uploadPath, fileBuffer);
    return `${path.posix.join(...filePath, randomName)}`;
  } catch (error) {
    throw error;
  }
};

const deleteFileFromDisk = async (filePath) => {
  try {
    await fs.promises.unlink(
      path.join(__dirname, "..", ...filePath.split("/")),
    );
  } catch (error) {
    console.log(error);
  }
};

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
    upload(req, res, async (err) => {
      if (err) {
        if (err.code === "INVALID_FILE_TYPE") {
          return res.status(400).json({
            errorDetails: err,
            errors: {
              0: { path: "image", msg: `Allowed files: ${allowedMimeTypes}` },
            },
          });
        }

        if (err instanceof multer.MulterError) {
          err.msg = err?.message;
          return res.status(400).json({
            errorDetails: err,
            errors: { 0: { path: "image", msg: `Error with uploading file` } },
          });
        }

        return next(err);
      }

      // 🔥 COMPRESS FILES HERE (automatic for all fields)
      if (req.files) {
        for (const fieldName in req.files) {
          req.files[fieldName] = await Promise.all(
            req.files[fieldName].map(async (file) => {
              // Compress the image buffer
              const compressedBuffer = await compressImage(
                file.buffer,
                file.mimetype,
              );

              return {
                ...file,
                buffer: compressedBuffer, // replace original buffer
                size: compressedBuffer.length,
                originalSize: file.size, // optional tracking
              };
            }),
          );
        }
      }

      next();
    });
  };
};

module.exports = { upload, saveFileToDisk, deleteFileFromDisk };
