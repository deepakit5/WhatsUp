import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    console.log('file: ', file);
    const ext = path.extname(file.originalname); // Get the file's original extension
    const safeName = file.fieldname + '-' + Date.now() + ext; // Unique and safe filename
    cb(null, safeName);
  },
});

export const upload = multer({
  storage,
});
