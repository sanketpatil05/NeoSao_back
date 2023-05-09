
const express = require("express");
const { connection } = require("./config/db");

const cors = require('cors');
const app = express();
const cloudinary = require("cloudinary");
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require("multer");
cloudinary.v2.config({
  cloud_name: 'dkonrrksg',
  api_key: '778845822147461',
  api_secret: 'SBpakFOv5ple8f8q_nx1djPNyKw',
  secure: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));



async function uploadToCloudinary(path) {



var filePathOnCloudinary = "folder" + "/" + path

return cloudinary.uploader.upload(path,{"public_id":filePathOnCloudinary})
.then((result) => {
 
  fs.unlinkSync(path)
  
  return {
    message: "Success",
    url:result.url
  };
}).catch((error) => {
  fs.unlinkSync(path)
  return {message: "Fail",};
});
}



app.post('/imageUpload', upload.single('url'), async (req, res, next) => {

var path = req.file.path
// console.log(path)
var result = await uploadToCloudinary(path)
console.log(result)

return res.send(result.url)
})


app.get("/", (req, res) => {
 
  res.send("welcome to home page");
});

 

 
 

app.listen(5000, async() => {
    try {
        await connection;
        console.log("connection done");
      } catch (err) {
        console.log(err);
      }
      console.log("server started on 5000");
});


