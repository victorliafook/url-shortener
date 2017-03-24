var express = require('express');
var mongodb = require('mongodb');

var app = express();
const urlPattern = /^(?:http:\/\/)?(?:www\.)?\w+\.\w{2,6}(?:\.\w{2})?$/;

app.get('/:par', function(req, res){
    var par = req.params.par;
    console.log(par);
    if(urlPattern.test(par)){
        res.send("URL!");
        return;
    }
    res.send("ISNT URL");
    
})
app.listen(process.env.PORT || 8081);
