    const express = require("express");
    const app = express();
    const port = 3000;
    const path = require('path')
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/', function (req, res) {
        res.sendFile("index.html");
        console.log("runnig")   
        });
        
    
    app.listen(port, () => {
        console.log('App listening on port 3000')
    })