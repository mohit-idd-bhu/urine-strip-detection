const express=require('express');
const path=require('path');
const multer=require('multer');
const bodyParser=require('body-parser');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
  
const uploads = multer({ storage: storage });

const app=express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname+'/views'));

app.post('/upload',uploads.single('strip'),(req,res)=>{
    const image=req.file;
    console.log(image);
    res.status(200).json({message:"submitted"});
})

app.listen(3000,()=>{
    console.log('Server Running');
})