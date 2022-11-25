const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const Image = require('./model')
require("./db/db");
const port = process.env.PORT || 8000;
const app = express();
const multer = require("multer");
const MulterSharpResizer = require("multer-sharp-resizer");

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

const multerStorage = multer.memoryStorage();
//Filter files with multer
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
 const uploadProductImages = upload.fields([
        { name: "cover", maxCount: 1 },
        // { name: "gallery", maxCount: 1 },
      ]);
     
      const resizerImages = async (req, res, next) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = `${today.getMonth() + 1}`.padStart(2, "0");
        const filename = {
          cover: `cover-${Date.now()}`,
          // gallery: `gallery-${Date.now()}`,
        };
        const sizes = [
          {
            path: "original",
            width: null,
            height: null,
          },
        
          {
            path: "thumbnail",
            width: 80,
            height: 80,
          },
        ];
        const uploadPath = `./public/uploads/${year}/${month}`;
        const fileUrl = `${req.protocol}://${req.get(
          "host"
        )}/uploads/${year}/${month}`;
   
        const sharpOptions = {
          fit: "contain",
          background: { r: 255, g: 255, b: 255 },
        };
        // create a new instance of MulterSharpResizer and pass params
        const resizeObj = new MulterSharpResizer(
          req,
          filename,
          sizes,
          uploadPath,
          fileUrl,
          sharpOptions
        );
//  console.log(resizeObj)
        await resizeObj.resize();
        const getDataUploaded = resizeObj.getData();
        // console.log(getDataUploaded)
        req.body.cover = getDataUploaded.cover;
        // req.body.gallery = getDataUploaded.gallery;
        next();
      };

      
   const createProduct = async (req, res) => {
   const cover =  req.body.cover; 
  //  if(cover=='0'){
  //   res.status(400).json({message:"Please select image first"})
  //  }
    const image = new Image({
      cover:cover[0]
    }
      );
       const createdImage = await image.save();
      //  console.log(createdImage)
    res.status(201).json({
      status: "success",
       cover:  createdImage._doc
      
    });
  
  };

const deleteimage1 = async (req, res) => {
  try {
  const id  = req.params.id;
    if (!id) {
      res.status(400).send("id is required");
    }
   const deleteuser = await Image.deleteOne({ _id: id })
    if (deleteuser) {
      res.status(200).json({ message: "user image deleted successfully" });
    }
    else {
      res.status(400).send("not delete")
    }
  } catch (err) {
    res.status(400).send(err)
    console.log(err)
  }
}


const deleteoriginalimage = async (req, res) => {
  try {
  const {id}  = req.body;
  // console.log(req.body);
    if (!id) {
      res.status(400).send("id is required");
    }
   const deleteuser = await Image.updateOne({ _id:id }, {$unset: {"cover.original.path":1}},
    // { _id: { $eq:id } },
    //     { original: { $exists: true } },
    //   { $unset: { original: 1 } },
     )
    //  console.log(deleteuser);
  if (deleteuser) {
    res.status(200).json({
      message: "original delete ",
      
    }) 
  } 
  
}catch (err) {
  res.status(400).send(err)
  console.log(err)
}}



const deletethumbimage = async (req, res) => {
  try {
  const {id}  = req.body;
  // console.log(req.body);
    if (!id) {
      res.status(400).send("id is required");
    }
   const deleteuser = await Image.updateOne({ _id:id }, {$unset: {"cover.thumbnail.path":1}},
    // { _id: { $eq:id } },
    //     { original: { $exists: true } },
    //   { $unset: { original: 1 } },
     )
    //  console.log(deleteuser);
  if (deleteuser) {
    res.status(200).json({
      message: "thumb delete",
      
    }) 
  } 
 
}catch (err) {
  res.status(400).send(err)
  console.log(err)
}}
// User.updateOne(
//   { _id: { $eq: u_id } },
//   {
//     $set: {
//       username,
//       email,
//     },
//   },
//   { new: true }
// );
// if (updateuser.modifiedCount) {
//   res.status(200).json({
//     message: "Your profile  has updated successfully",
//     updateuser,
//   });
// } 


// const createProduct = async (req, res, next) => {
//    const cover =  req.body.cover; 
//    const image = new Image({
// cover});
//       const createdImage = await image.save();
//     res.status(201).json({
//     status: "success",
//     cover:
//           createdImage._doc
      
   
//     //   gallery: req.body.gallery,
//     });
//     };

// { },
// { $unset: { original : "name" } }

  // const createProduct = async (req, res, next) => {

  //   const cover =  req.body.cover; 
  //   const image = new Image({cover});
  //      const createdImage = await image.save();
  //    console.log(createdImage.cover[0]);
  //   res.status(201).json(
     
    
  //     // cover: req.body.cover,
  //     createdImage.cover[0]

  //   //   gallery: req.body.gallery,
  //   );
  
  // };

const getImage = async(req,res)=>{
  const images = await Image.find();
  // const images = imagess[0]
  res.status(200).json({images})

}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/images", uploadProductImages, resizerImages,createProduct);
app.get("/images", getImage);
app.delete("/images/:id",deleteimage1)
app.patch("/images",deleteoriginalimage)
app.patch("/imagest",deletethumbimage)


app.listen(port, () => console.log(`CONNECTION IS SETUP AT ${port}`));
