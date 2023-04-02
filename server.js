const express=require('express');
const path=require('path');
const multer=require('multer');
const bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname+'/views'));

const { spawn } = require('child_process');

async function python_run(){
  const pythonProcess = spawn('python', ['strip-detect.py']);
  const closePromise = new Promise((resolve, reject) => {
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });
  });

  let data = '';
  pythonProcess.stdout.on('data', (chunk) => {
    data += chunk;
  });

  await closePromise;
  const jsonData = JSON.parse(data);
  return jsonData
}



const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const suffix = path.extname(file.originalname);
      cb(null, 'image' + suffix);
    }
  });
  
const uploads = multer({ storage: storage });

app.post('/upload',uploads.single('strip'),async (req,res)=>{
    try{
      const data=await python_run();
      res.status(200).json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({message:"Make Sure to install python and opencv in running environment"});
    }
})

const port= process.env.PORT||3000;

app.listen(port,()=>{
    console.log(`Server Running on port ${port}`);
})