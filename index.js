const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const ejsLint = import('ejs-lint');

const app = express();

ejsLint('pages/cart')

mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fastfood_db"
})

// functions
function IsProductInCart(cart, id){
    for(let i=0; i<cart.length; i++){
        if(cart[i].id === id){
            return true;
        }
    }
    return false;
}

function calculateTotal(cart, request){
	let total = 0;
    for(let i = 0; i<cart.length; i++){
        if(cart[i].sale_price){
            total = total + (cart[i].sale_price * cart[i].quantity);
        } else {
            total = total + (cart[i].price * cart[i].quantity);
        }
    }

    request.session.total = total;
    return total;
}

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(8080)
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(session({
    secret: "secret"
}))

// localhost:8080
app.get('/', function(request, response) {
    const db_conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "fastfood_db"
    })

    db_conn.query("SELECT * FROM products", (err, result) => {
        response.render('pages/index', {result:result})
    })
});

app.post('/add_to_cart', function(request, response){
	const id = request.body.id;
	const name = request.body.name;
	const price = request.body.price;
	const sale_price = request.body.sale_price;
	const quantity = request.body.quantity;
	const image = request.body.image;

	const product = {
		id: id,
		name: name,
		price: price,
		sale_price: sale_price,
		quantity: quantity,
		image: image
	};

	if(request.session.cart){
		var cart = request.session.cart;

		if(!IsProductInCart(cart, id)){
            cart.push(product);
        }
    } else {
        request.session.cart = [product];
        var cart = request.session.cart;
    }

    //calculate total
    calculateTotal(cart, request);

    //return to cart
    response.redirect('/cart');
});

app.get('/cart', function(request, response){
	const cart = request.session.cart;
	const total = request.session.total;

	response.render('pages/cart', {cart:cart, total:total})
})

