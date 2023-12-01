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

	    // Log what the user has entered
	    // console.log("Seller ID:", seller_id);

	    if(name && street && city && state && zip && email && phone_number) {
			sql = "INSERT INTO Seller VALUES (SELLER_ID_GENERATOR.NEXTVAL, :1, :2, :3, :4, :5, :6, '', :7)"
			binds = [name, street, city, state, zip, email, phone_number]
			insertData(sql, binds).then((response2) => {
  				if(response2)
					response.send("Seller account creation was successful.")
					
				else
					response.send("Seller account could not be created. Ensure input is valid and try again.");
			});
            
        }
    });

	app.post('/getProducts', function(request, response) {
	    // Capture the input fields
	    let seller_id = request.body.seller_id;

	    // Log what the user has entered
	    console.log("Seller ID:", seller_id);

	    if(seller_id) {
			sql = 'SELECT * FROM product WHERE seller_id = :1'
			binds = [seller_id]
			retrieveMatchingData(sql, binds).then((response2) => {
  				if(response2)
					response.redirect('/showResults')
				else
					response.send("No results found. Ensure input is valid and try again.");
			});
            
        }
    });

	app.post('/getPurchases', function(request, response) {
	    // Capture the input fields
	    let seller_id = request.body.seller_id;

	    // Log what the user has entered
	    console.log("Seller ID:", seller_id);

	    if(seller_id) {
			sql = 'SELECT * FROM Purchase WHERE listing_id IN (SELECT listing_id FROM Product WHERE seller_id = :1) ORDER BY customer_id'
			binds = [seller_id]
			retrieveMatchingData(sql, binds).then((response2) => {
  				if(response2)
					response.redirect('/showResults')
				else
					response.send("No results found. Ensure input is valid and try again.");
			});
            
        }
    });

	app.post('/updateavailability', function(request, response) {
	    // Capture the input fields
	    let bikeid = request.body.bikeid;
	    let bavailable = request.body.bavailable;

	    // Log what the user has entered
	    console.log("ID Entered:", bikeid, ", Availability Entered:", bavailable);

	    if (bikeid && bavailable){

            updateMatchingBike();

            async function updateMatchingBike(){

				try {
					const updateBike = await connection.execute(
						`UPDATE BIKES
						 SET bavailable = :1
						 WHERE bikeid = :2`,
						[bavailable, bikeid]
					);

					if (updateBike.rowsAffected === 1) { // confirms that only one row was affected, as expected
						await connection.commit(); // commits the changes to the remote DB
	
						const updateJson = await connection.execute( // select query to confirm the change was made and update the json
							'SELECT * FROM BIKES'
						);
		
						fs.writeFileSync('./json/bikesdata.json', JSON.stringify(updateJson.rows)); // puts the result in the json
						response.redirect('/showResults');
					} else {
						response.send("An error occurred. Please try again.")
					}
				} catch { // error message if the update did not work
					response.send("Bike update was unsuccessful. Check that the values are in the correct range and try again.");
				}
            }
        }
    });

	/* 
	   Along with SELECT and UPDATE statements, you can also use insert statements to add more rows.
	   Example: 

	   const result = await connection.execute(
			`INSERT INTO <TABLE NAME> VALUES (:1, :2, :3)`,
			[value1, value2, value3]
		);
	*/
	
	async function retrieveMatchingData(sql, binds){
		let options = {outFormat: oracledb.OUT_FORMAT_OBJECT}
		let result = await connection.execute(sql, binds, options)
	
		if (result.rows.length > 0) {
			fs.writeFileSync('./json/data.json', JSON.stringify(result)) // puts the result in the json
			console.log("Results: ", result.rows)
			console.log("Length: ", result.rows.length)
			return true
		} else {
			console.log("No new data")
			return false
		}
	}

	async function insertData(sql, binds){
		// let options = {outFormat: oracledb.OUT_FORMAT_OBJECT}
		// let result = await connection.execute(sql, binds, options)

		let result = await connection.execute(sql, binds)
		await connection.execute('Commit')

		console.log(result)
	
		if(result)
			return true
		else
			return false
	}

});

app.listen(PORT);
console.log('Server started at http://localhost:' + PORT);