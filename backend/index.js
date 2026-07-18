const express = require('express');
const multer  = require('multer')
const cors = require('cors');
const docxConverter = require('docx-pdf');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Setting up the file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
});

const upload = multer({ storage: storage });
app.post('/convertFile', upload.single('file'), (req, res, next)=> {
try {

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }

    // DEFINING OUTPUT FILE PATH
    const outoutPath = path.join(
        __dirname, 
        'files',
        `${req.file.originalname}.pdf`
    );
  docxConverter(req.file.path, outoutPath, (err,result)=>{
  if(err){
    console.log(err);
    return res.status(500).json({
      message: 'Error converting docx to pdf',
    })
  }
  res.download(outoutPath, (err) => {
  console.log('file download');
  })
});
} catch (error) {
  console.log(error);
  res.status(500).json({
    message: 'Internal server error',
  })
}
});

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});