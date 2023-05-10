
const express = require("express");
const { connection } = require("./config/db");
const Image=require("./model/image.model")
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



app.post('/imageUpload', upload.single('url'), async (req, res, ) => {

var path = req.file.path
//console.log(req.query)
var result = await uploadToCloudinary(path)

  
const data={
  image_type:req.query.type,
  url:result.url
}  
const image_data=await Image.insertMany([data])
return res.send(image_data)

 
})

app.get("/images/:id",async(req,res)=>{
  
   const{id}=req.params; 
   const data=await Image.find({image_type:id});

   res.send(data)

})
app.get("/images",async(req,res)=>{

  const data=await Image.find();
  res.send(data);
})

app.get("/", (req, res) => {
 
  res.send("welcome to home page of app");
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


