var express = require('express');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var jsHashCode = require('./js-hash-code');


var app = express();
//const url = 'mongodb://localhost:27017/urlshortener';
const url = process.env.MONGOLAB_URI;

//provides String.prototype with hashCode  method.
jsHashCode();

//regex pattern to route the urls to be minified
const urlPattern = /^\/(http:\/\/(?:www\.)?\w+\.\w{2,6}(?:\.\w{2})?)$/;
const hashPattern = /^\/(-?[0-9abcdefABCDEF]{3,8})$/;
var collection;

mongodb.connect(url, function(err, db) {
    if(err){
        console.log(err);
        throw err;
    }
    collection = db.collection('shortened-urls');
    
});

app.get(urlPattern, function(req, res){
    console.log("is a valid url");
    var inDb = false;
    var par = req.params[0];
    
    collection.findOne({url: par}, function(err, doc){
        if(err) console.log(err);
        console.log(doc);
        if(doc){
            console.log("it already was in database! " + doc.url);
            res.json(new ReturnObj(req, doc.url));
            inDb = true;
            return;
        }
        
    });
    if(inDb) return;
        
    collection.insertOne({url: par, hash: returnHexHash(par)}, function(err, doc){
        if(err) console.log(err);
        res.json(new ReturnObj(req, par));
    });
});

app.get(hashPattern, function(req, res){
    var par = req.params[0].toLowerCase();
    console.log(par);
    collection.findOne({hash: par}, function(err, doc){
        if(err){
            console.log(err);
            res.status(500).end();
        }
        if(doc){
            res.redirect(doc.url);
            return;
        }else{
            res.json(new ErrorMsg("This hash is not on the database."));
            return;
        }
        
    });

});

app.get('/:par', function(req, res){
    console.log(req.params.par);
    res.json(new ErrorMsg("This isn't a valid url"));
});

app.listen(process.env.PORT || 8081);

function ReturnObj(req, urlStr){
    this.oldUrl = urlStr;
    this.newUrl = req.protocol + '://' + req.get('host') + '/' + returnHexHash(urlStr);
}

function ErrorMsg(msg){
    return {error: msg};
}

function returnHexHash(urlStr){
    return urlStr.hashCode().toString(16);
}
