const crypto = require("crypto");
const path = require("path");
const storage = require("../utils/firebaseStorage");
const {
  uploadBytesResumable,
  getDownloadURL,
  ref,
} = require("firebase/storage");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");

module.exports = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  // Check the type of the file
  if (!req.file.mimetype.startsWith("image")) {
    return next(
      new ErrorResponse(
        "Invalid file type. Please upload only image files.",
        400
      )
    );
  }
  // Check the size of the file reach the 1MB
  if (req.file.size > 1048576) {
    return next(
      new ErrorResponse(
        "The file you selected is too large. Please select a file that is less than 1MB in size.",
        400
      )
    );
  }

  const random = crypto.randomBytes(10).toString("hex");
  const extname = path.extname(req.file.originalname);
  const name = req.file.originalname.slice(
    0,
    req.file.originalname.indexOf(extname) - 1
  );

  const imageName = name + random + extname;

  const imageRef = ref(storage, `/post-cover/${imageName}`);

  await uploadBytesResumable(imageRef, req.file.buffer, {
    contentType: req.file.mimetype,
  });
  req.body.coverImage = await getDownloadURL(imageRef);

  next();
});
