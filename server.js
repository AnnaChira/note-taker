var fs = require("fs");
var path = require("path");
var express = require("express");
const { send } = require("process");

var app = express();
var router = express.Router();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

router.get("/notes", function(req, res){
    console.log(req);
    fs.readFile(path.join(__dirname, "/public/notes.html"),"UTF-8", function(error, file){
        res.set('Content-Type', 'text/html')
        res.send(file);
    });
});

router.get("/api/notes", function(req, res){
    console.log(req);
    fs.readFile(path.join(__dirname, "/db/db.json"),"UTF-8", function(error, file){
        file = JSON.parse(file);
        file = file.map(function(note, index) {
            note.id = index;
            return note;
        })
        res.json(file);
    });
});

router.post("/api/notes", function(req, res){
    console.log(req);
    fs.readFile(path.join(__dirname, "/db/db.json"),"UTF-8", function(error, file){
        file = JSON.parse(file);
        file.push(req.body);
        fs.writeFile(path.join(__dirname, "/db/db.json"),JSON.stringify(file),"UTF-8", function(error, file) {
            res.json(file);
        });
    });
});

router.delete('/api/notes/:id', function (req, res) {
    fs.readFile(path.join(__dirname, "/db/db.json"),"UTF-8", function(error, file){
        file = JSON.parse(file);
        file.splice(req.params.id, 1);
        fs.writeFile(path.join(__dirname, "/db/db.json"),JSON.stringify(file),"UTF-8", function(error, file) {
            res.json(file);
        });
    });
  });

router.get("*", function(req, res){
    console.log(req);
    fs.readFile(path.join(__dirname, "public/index.html"),"UTF-8", function(error, file){
        res.set('Content-Type', 'text/html')
        res.send(file);
    });
});

app.use("/", router);

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
