/*
server.js

Sets all of the routes in your application to be able to navigate
between pages and send data back and forth.
*/

var http = require('http');
var fs = require('fs');
var express = require('express');
const app = express();
const path = require('path');
const oracledb = require('oracledb');
var connection = require('./connectToDB.js'); // connect to DB
var bodyParser = require('body-parser'); // middleware

const PORT = process.env.PORT || 3000; //Sets UI to http://localhost:3000/

// USED TO COLLECT INFORMATION FROM PAGE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// RENDER ALL OF THE PROJECT'S CSS FILES
app.use(express.static(path.join(__dirname, 'public')));

// ESTABLISHES CONNECTION FIRST BEFORE ROUTING
connection.then(connection => {

	// SET ALL THE ROUTES TO APP PAGES
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '/homepage.html'));
	});
	app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname, '/homepage.html'));
	});
	app.get('/connectToDB', function(req, res) {
		res.sendFile(path.join(__dirname, '/connectToDB.js'));
	});
    app.get('/showResults', function(req, res) {
		res.sendFile(path.join(__dirname, '/showResults.html'));
	});

	// GET PATHS TO JSON FILES & CREATIVE FILES
	app.get('/retrievedDataJson', function(req, res) {
		res.sendFile(path.join(__dirname, '/json/data.json'));
	});

    // SET ROUTES TO GET/UPDATE/INSERT DATA
	app.post('/createSeller', function(request, response) {
	    // Capture the input fields
	    let name = request.body.name;
		let street = request.body.street;
		let city = request.body.city;
		let state = request.body.state;
		let zip = request.body.zip;
		let email = request.body.email;
		let phone_number = request.body.phone_number;

	    if(name && street && city && state && zip && email && phone_number) {
			sql = "INSERT INTO Seller VALUES (SELLER_ID_GENERATOR.NEXTVAL, :1, :2, :3, :4, :5, :6, DEFAULT, :7)"
			binds = [name, street, city, state, zip, email, phone_number]
			insertOrUpdateData(sql, binds).then((response2) => {
  				if(response2)
					response.send("Seller account was created successfully.")
				else
					response.send("Seller account could not be created. Ensure input is valid and try again.")
			});
            
        }
    });

	app.post('/getProducts', function(request, response) {
	    // Capture the input fields
	    let seller_id = request.body.seller_id

	    // Log what the user has entered
	    console.log("Seller ID:", seller_id)

	    if(seller_id) {
			sql = 'SELECT * FROM product WHERE seller_id = :1'
			binds = [seller_id]
			retrieveMatchingData(sql, binds).then((response2) => {
  				if(response2)
					response.redirect('/showResults')
				else
					response.send("No results found. Ensure input is valid and try again.")
			});
            
        }
    });

	app.post('/getPurchases', function(request, response) {
	    // Capture the input fields
	    let seller_id = request.body.seller_id;

	    // Log what the user has entered
	    console.log("Seller ID:", seller_id)

	    if(seller_id) {
			sql = 'SELECT * FROM Purchase WHERE listing_id IN (SELECT listing_id FROM Product WHERE seller_id = :1) ORDER BY customer_id'
			binds = [seller_id]
			retrieveMatchingData(sql, binds).then((response2) => {
  				if(response2)
					response.redirect('/showResults')
				else
					response.send("No results found. Ensure input is valid and try again.")
			});
            
        }
    });

	app.post('/createProduct', function(request, response) {
	    // Capture the input fields
	    let name = request.body.name;
		let quantity_type = request.body.quantity_type;
		let quantity = request.body.quantity;
		let price = request.body.price;
		let discount = request.body.discount;
		let item_category = request.body.item_category;
		let seller_id = request.body.seller_id;

	    if(name && quantity_type && quantity && price && discount && item_category && seller_id) {
			sql = "INSERT INTO Product VALUES (LISTING_ID_GENERATOR.NEXTVAL, 'true', :1, :2, :3, :4, :5, :6, :7)"
			binds = [name, quantity_type, quantity, price, discount, item_category, seller_id]
			insertOrUpdateData(sql, binds).then((response2) => {
  				if(response2)
					response.send("Product was created successfully.")
				else
					response.send("Product could not be created. Ensure input is valid and try again.")
			});
            
        }
    });

	app.post('/updateProduct', function(request, response) {
	    // Capture the input fields
	    let listing_id = request.body.listing_id;
	    let quantity = request.body.quantity;
		let price = request.body.price;
		let discount = request.body.discount;

	    // Log what the user has entered
	    // console.log("Listing ID:", listing_id, ", Quantity:", quantity, ", Price:", price, ", Discount:", discount)

	    if(listing_id && (quantity || price || discount)) {

			// "UPDATE product SET quantity = :1, price = :2, discount = :3 WHERE listing_id = :4"
			var count = 1
			var sql = "UPDATE Product SET "
			var binds = []
			
			if(quantity != '') {
				sql += "quantity = :" + count
				count++
				binds.push(quantity)
			}
			if(price != '') {
				if(count > 1)
					sql += ", "
				sql += "price = :" + count
				count++
				binds.push(price)
			}
			if(discount != '') {
				if(count > 1)
					sql += ", "
				sql += "discount = :" + count
				count++
				binds.push(discount)
			}

			sql += " WHERE listing_id = :" + count
			binds.push(listing_id)

			insertOrUpdateData(sql, binds).then((response2) => {
  				if(response2)
					response.send('Product with Listing ID = ' + listing_id + ' was successfully updated.')
					
				else
					response.send("Listing could not be updated. Ensure input is valid and try again.")
			});

        }
    });
	
	async function retrieveMatchingData(sql, binds) {
		let options = {outFormat: oracledb.OUT_FORMAT_OBJECT}
		let result = await connection.execute(sql, binds, options)
	
		if (result.rows.length > 0) {
			fs.writeFileSync('./json/data.json', JSON.stringify(result)) // puts the result in the json
			// console.log("Results: ", result.rows)
			// console.log("Length: ", result.rows.length)
			return true
		} else {
			console.log("No new data")
			return false
		}
	}

	async function insertOrUpdateData(sql, binds) {
		// let options = {outFormat: oracledb.OUT_FORMAT_OBJECT}
		// let result = await connection.execute(sql, binds, options)
		try {
			let result = await connection.execute(sql, binds)
			
			// console.log(result)
		
			if(result.rowsAffected === 1) {
				await connection.execute('Commit')
				return true
			}
		} catch {
			return false
		}
	}

});

app.listen(PORT);
console.log('Server started at http://localhost:' + PORT);