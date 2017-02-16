// If not, the app should log a phrase like Insufficient quantity!, 
// and then prevent the order from going through.
// However, if your store does have enough of the product, 
// you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.
// Also insert a record into the sales table with the product_id and quantity 
// purchased and current timestamp

//----------------------------------------------------------------------------------------------

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Avernus#1',
  database : 'bamazon_db',
});

connection.connect();

// Running this application will first display all of the items available for sale. 
// Include the ids, names, and prices of products for sale.
var startOrder = function() {

	connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (error, results) 
	{
		// output results into terminal cleanly.
		for (var i = 0; i < results.length; i++) {
			var productID = results[i].id;
			var productName = results[i].product_name;
			var price = results[i].price;
			var productObj = {id: productID, product_name: productName, price: price};

			console.log("Product ID: " + productID + " Product Name: " + productName + " Price: " + price);
		};

		// begin prompt to take order
		inquirer.prompt([{
		type: "input",
		name: "product_id",
		message: "Please enter the product ID you would like to purchase: ",
		validate: function(value) {
      			if (isNaN(value) === false && value > 0) {
        			return true;
      			} else {
      				return false;
      			}	
      		}	
		}, {
		type: "input",
		name: "purchase_quant",
		message: "Quantity you want to purchase: ",
		validate: function(value) {
      			if (isNaN(value) === false && value > 0) {
        			return true;
      			} else {
      				return false;
    			}
    		}
		}]).then(function(data) {
			var id = data.product_id;
			var quant = data.purchase_quant;

			console.log(id, quant);

			connection.query("SELECT price, stock_quantity FROM products WHERE id = " + id, function (error, results) {
				var stockQuant = results.stock_quantity;

				if (stockQuant - quant < 0) {
					console.log("Your order could not be placed. We do not have enough in stock.");
				} else {
					
				}
			});

		});

	}
)};	

startOrder();

// var checkInventory = function() {
// 	connection.query()
// }

// The first should ask them the ID of the product they would like to buy.
	// The second message should ask how many units of the product they would like to buy.
	// Once the customer has placed the order, your application should check if your 
	// store has enough of the product to meet the customer's request.
		
// 		inquirer.prompt([{
// 			type: "input",
// 			name: "product_id",
// 			message: "Please enter the product ID you would like to purchase: ",
// 			validate: function(value) {
//       					if (isNaN(value) === false) {
//         					return true;
//       					}
//       					return false;
//     				  }		
// 		}, {
// 			type: "input",
// 			name: "purchase_quant",
// 			message: "Quantity you want to purchase: ",
// 			validate: function(value) {
//       					if (isNaN(value) === false) {
//         					return true;
//       					}
//       					return false;
//     				  }
// 		}]).then(function(data) {

// 		});
//   	});
// };



// var updateInventory = function(quantity) {
// 	connection.query("UPDATE " + table + " SET ? WHERE ?", [{
// 		name : 'bruno beer'
// 	  }, {
// 	  	id : id
// 	  }], function(err, res) { 
// 	  	if (err) return console.log(err);
// 	  	console.log('update completed!')
// 	  });

	// connection.query("UPDATE products )
// }

//NOT IN USE---------------------------------------------------------------------------------
// function selectTable(table){
// 	connection.query('SELECT * from ' + table, function (error, results, fields) {
// 	  if (error) throw error;
// 	  console.log(results);
// 	});
// }
//--------------------------------------------------------------------------------------------
// connection.query('SELECT * from drankers', function (error, results, fields)
// {
// 	console.log(results);
// 	console.log('\n');

// 	inquirer.prompt([
// 	{type: "input",
// 	  name: "dranker_id",
// 	  message: "Put the id of the dranker you are."}
// 	]).then(function(data){
// 		var dranker = data.dranker_id;

// 		connection.query('SELECT * from beers', function (error, results, fields) {
// 			console.log(results);
// 			console.log('\n');
// 			inquirer.prompt([
// 			{type: "input",
// 			  name: "beer_id",
// 			  message: "Put the id of the beer that you want."}
// 			]).then(function(data){
// 				//do an insert into mysql 
// 				connection.query('INSERT into dranken_beers SET ?', {
// 					beer_id : data.beer_id,
// 					dranker_id : dranker
// 				}, function (error, results, fields) {
// 					console.log('insert complete')
// 				});
// 			});
// 		});

// 	});
// });

// function insertIntoTable(name, type, abv, table){
//   connection.query("INSERT INTO " + table + " SET ?", {
//       name: name,
//       type: type,
//       abv: abv
//     }, function(err, res) { console.log('completed!')});
// }

// function deleteFromTable(id, table){
// 	connection.query("DELETE FROM " + table + " WHERE ?", {
// 	    id: id
// 	  }, function(err, res) { 
// 	  	if (err) return console.log(err);
// 	  	console.log('delete completed!')
// 	  });
// }

// //write update function
// function updateTable(id, table){
// 	connection.query("UPDATE " + table + " SET ? WHERE ?", [{
// 		name : 'bruno beer'
// 	  }, {
// 	  	id : id
// 	  }], function(err, res) { 
// 	  	if (err) return console.log(err);
// 	  	console.log('update completed!')
// 	  });
// }

// //write delete function


// // insertIntoTable('beer', 'i dont know beer', 100, 'beers');
// // deleteFromTable(7, 'beers');
// updateTable(1, 'beers');