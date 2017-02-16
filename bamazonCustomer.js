var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Avernus#1',
  database : 'bamazon_db',
});

connection.connect();

var order = [];

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
      			if (isNaN(value) === false && value > 0 && value < results.length) {
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
			var item_name = results[id - 1].product_name;
			var item_price = results[id - 1].price;
			var item = {};

			if (results[id - 1].stock_quantity - quant < 0 ) {
				console.log("Your order could not be placed. We do not have enough in stock.");
			} else {
				connection.query("UPDATE products SET stock_quantity = (stock_quantity - " + quant + ") WHERE id = " + id, function (error, results) 
				{
					if (error) {
						return console.log("There was an error updating the products table.");
					};
				});

				connection.query("INSERT INTO sales (product_id, quantity_purchased) VALUES (" + id + ", " + quant + ")", function (error, results) 
				{
					if (error) {
						return console.log("Error inserting into sales table.");
					};
				});

				item["item"] = item_name;
				item["price"] = item_price;
				item["quantity"] = quant;

				order.push(item);

				shopMore();
			};
		});
	});
};	

//-----------------FUNCTIONS-------------------------------------------------------
var shopMore = function() {
	inquirer.prompt({
		type: "confirm",
		name: "shopMore",
		message: "Are you done shopping? "
	}).then(function(data) {
		if (!data.shopMore) {
			startOrder();
		} else {
			checkOut();
		};
	});
};

var checkOut = function() {
	var total = 0;
	console.log("\nYou purchased: ");

	for (var i = 0; i < order.length; i++) {
		console.log("Item " + (i + 1) + ": " + order[i].item + " Quantity: " + order[i].quantity + " Price: " + order[i].price);
		total += (order[i].price * order[i].quantity);
	};

	console.log("Your total is: $" + total);
	console.log("Thank you! Come again!");
};

startOrder();