const express = require('express');
const ejs = require('ejs');
const { bodyParser } = require('body-parser');
const mysql = require('mysql');

mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fastfood_db"
})

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(8080)
app.use(bodyParser.urlencoded({
    extended:true
}))

// localhost:8080
app.get('/', function(request, response) {
    response.render('pages/index')
});