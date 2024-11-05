const asyncHandler = require("express-async-handler");

const getUploadPage = asyncHandler(async (req, res) => {
    res.render("pages/upload", { title: "Upload", user: req.user });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, fileExtension);
      cb(null, `${baseName}-${uniqueSuffix}${fileExtension}`);
    }
});
  
const upload = multer({ storage: storage });

const createFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    res.send(`File uploaded as: ${req.file.filename}`);
});

module.exports = {
    getUploadPage,
    createFile,


};