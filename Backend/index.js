//import the necessary dependencies
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fileUpload from 'express-fileupload';
import { spawn } from 'child_process';


//gets the pathname of the current file e.g index.js
const __filename = fileURLToPath(import.meta.url);
//gets the pathname of the current directory
const __dirname = dirname(__filename);


//create an app
const app = express()
//use the middleware
//handle file uploads e.g PDFs, images, etc
app.use(fileUpload())

//api to handle the uploaded pdf invoice
app.post("/upload", async(req, res) => {
    try{
        //check whether req.files exists and whether the invoice file exists
        if (!req.files?.invoice) {
            return res.status(400).json({ error: 'No PDF uploaded' });
        }
        
        //save the PDF file
        const pdf = req.files.invoice
        const uploadPath = path.join(__dirname, 'uploads', pdf.name)
        await pdf.mv(uploadPath);

        //call the python script
        const pythonProcess = spawn("python3", [
            "invoice_extractor.py",
            uploadPath
        ])
        
        //take data in chunks and concatenate it to the final string
        let result = "";
        pythonProcess.on("data", (data) => {
            result += data.toString(); // Collect Python output
        })

        //check whether the script was processes successfully code == 0
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Python script failed' });
          }

          //Send extracted data to frontend
          res.json(JSON.parse(result));
    });

    }catch(error){
        res.status(500).json({
            success : false, 
            error : "Server Error"
        })
    }
})

const PORT = 5000;
app.listen(() => {
    console.log(`Server running on port ${PORT}...`);
})