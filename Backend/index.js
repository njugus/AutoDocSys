//import the necessary dependencies
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
// import fileUpload from 'express-fileUpload'
import { dirname } from 'path';
import fileUpload from 'express-fileupload';


//gets the pathname of the current file e.g index.js
const __filename = fileURLToPath(import.meta.url);
//gets the pathname of the current directory
const __dirname = dirname(__filename);


//create an app
const app = express()

const PORT = 5000;
app.listen(() => {
    console.log(`Server running on port ${PORT}`);
})