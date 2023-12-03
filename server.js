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
	app.get('/seller', function(req, res) {
		res.sendFile(path.join(__dirname, '/seller.html'));
	});
	app.get('/customer', function(req, res) {
		res.sendFile(path.join(__dirname, '/customer.html'));
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

    // SET ROUTES FOR SELLER REQUIREMENTS
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

	app.post('/getProductsForSeller', function(request, response) {
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

	app.post('/restockProduct', function(request, response) {
	    // Capture the input fields
	    let listing_id = request.body.listing_id;
	    let quantity = request.body.quantity;

	    // Log what the user has entered
	    // console.log("Listing ID:", listing_id, ", Quantity:", quantity)


		// NOT WORKING RN!!!!!
	    if(listing_id && quantity) {

			// sql = 'EXECUTE restock(:1, :2)'
			sql = 'BEGIN restock(:1, :2); END'
			binds = [listing_id, quantity]

			runProcedure(sql, binds).then((response2) => {
  				if(response2)
					response.send('Product with Listing ID = ' + listing_id + ' was successfully restocked.')
					
				else
					response.send("Listing could not be restocked. Ensure input is valid and try again.")
			});

        }
    });

	// SET ROUTES FOR CUSTOMER REQUIREMENTS
	app.post('/createCustomer', function(request, response) {
	    // Capture the input fields
	    let name = request.body.name;
		let street = request.body.street;
		let city = request.body.city;
		let state = request.body.state;
		let zip = request.body.zip;
		let email = request.body.email;
		let phone_number = request.body.phone_number;

	    if(name && street && city && state && zip && email && phone_number) {
			sql = "INSERT INTO Customer VALUES (CUSTOMER_ID_GENERATOR.NEXTVAL, :1, :2, :3, :4, :5, :6, DEFAULT, :7)"
			binds = [name, street, city, state, zip, email, phone_number]
			insertOrUpdateData(sql, binds).then((response2) => {
  				if(response2)
					response.send("Customer account was created successfully.")
				else
					response.send("Customer account could not be created. Ensure input is valid and try again.")
			});
            
        }
    });

	app.post('/getProductsForCustomer', function(request, response) {
	    // Capture the input fields
	    let name = request.body.name
		let item_category = request.body.item_category

	    if(name || item_category) {

			var count = 1
			var sql = "SELECT * FROM Product WHERE "
			var binds = []

			if(name != '') {
				sql += "name = :" + count
				count++
				binds.push(name)
			}
			if(item_category != '') {
				if(count > 1)
					sql += " AND "
				sql += "item_category = :" + count
				count++
				binds.push(item_category)
			}

			console.log(sql)
			console.log(binds)
			retrieveMatchingData(sql, binds).then((response2) => {
  				if(response2)
					response.redirect('/showResults')
				else
					response.send("No results found. Ensure input is valid and try again.")
			});
            
        }
    });

	app.post('/viewCart', function(request, response) {
	    // Capture the input fields
	    let customer_id = request.body.customer_id;

	    // Log what the user has entered
	    console.log("Customer ID:", customer_id)

	    if(customer_id) {
			sql = 'SELECT * FROM Cart WHERE customer_id = :1'
			binds = [customer_id]
			retrieveMatchingData(sql, binds).then((response2) => {
  				if(response2)
					response.redirect('/showResults')
				else
					response.send("No results found. Ensure input is valid and try again.")
			});
            
        }
    });

	app.post('/addItemToCart', function(request, response) {
	    // Capture the input fields
	    let customer_id = request.body.customer_id;
		let listing_id = request.body.listing_id;
		let quantity = request.body.quantity;

	    if(customer_id && listing_id && quantity) {
			sql = "INSERT INTO Cart VALUES (:1, :2, :3, DEFAULT)"
			binds = [customer_id, listing_id, quantity]
			insertOrUpdateData(sql, binds).then((response2) => {
  				if(response2)
					response.send("Listing was added to the cart successfully.")
				else
					response.send("Listing could not be added to the cart. Ensure input is valid and try again.")
			});
            
        }
    });

	// NEED TO FINISH ONCE CHECKOUT PROCEDURE DONE!!!!
	app.post('/checkout', function(request, response) {
	    // Capture the input fields
	    let customer_id = request.body.customer_id;

	    if(customer_id) {
			sql = "EXECUTE checkout(:1)"
			binds = [customer_id]
			insertOrUpdateData(sql, binds).then((response2) => {
  				if(response2)
					response.send("Checkout was successful.")
				else
					response.send("Checkout could not be completed. Ensure input is valid and try again.")
			});
            
        }
    });

	// DRIVER FUNCTIONS FOR SQL QUERIES
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
		let options = {outFormat: oracledb.OUT_FORMAT_OBJECT}

		try {
			let result = await connection.execute(sql, binds)
			
			console.log(result)
		
			if(result.rowsAffected === 1) {
				await connection.execute('Commit')
				return true
			}
		} catch {
			return false
		}
	}

	async function runProcedure(sql, binds) {
		let options = {outFormat: oracledb.OUT_FORMAT_OBJECT}
		
		// try {
			let result = await connection.execute(sql, binds, options)
			
			console.log(result)
		
			// if(result.rowsAffected === 1) {
				await connection.execute('Commit')
				return true
			// }
		// } catch {
		// 	return false
		// }
	}

});

app.listen(PORT);
console.log('Server started at http://localhost:' + PORT);