import express from 'express'

//create an app
const app = express()

const PORT = 5000;
app.listen(() => {
    console.log(`Server running on port ${PORT}`);
})