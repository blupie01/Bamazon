var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Avernus#1',
  database : 'bamazon_db',
});

connection.connect();

function displayMenu() {
	console.log("Menu Options:");
	console.log("1. View Products for Sale");
	console.log("2. View Low Inventory");
	console.log("3. Add to Inventory");
	console.log("4. Add New Product");

	inquirer.prompt([{
		type: "input",
		name: "option",
		message: "Choose a menu option: ",
		validate: function(value) {
			if (isNaN(value) === false && 0 > value < 4) {
				return true;
			} else {
				return false;
			}
		}
	}]).then(function(data) {
		console.log("You chose option: " + data.option);

		if (data.option == 1) {
			connection.query("SELECT * FROM products", function (error, results) {
				if (error) {
					console.log("Error selecting table.");
				} else {
					for (var i = 0; i < results.length; i++) {
						console.log("ID: " + results[i].id + " Product: " + results[i].product_name + 
							" Stock Quantity: " + results[i].stock_quantity);
					}
					restart();
				}
			})
		} else if (data.option == 2) {
			connection.query("SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 5", function (error, results) {
				if (error) {
					console.log("Error accessing data");
				} else {
					for (var i = 0; i < results.length; i++) {
						console.log("Product: " + results[i].product_name + " Stock Quantity: " + results[i].stock_quantity);
					}
					restart();
				}
			})
		} else if (data.option == 3) {
			connection.query("SELECT * FROM products", function (error, results) {
				if (error) {
					console.log("Error accessing data");
				} else {
					for (var i = 0; i < results.length; i++) {
					console.log("ID: " + results[i].id + " Product: " + results[i].product_name + 
						" Price: " + results[i].price + " Stock Quantity: " + results[i].stock_quantity);
					};

					inquirer.prompt([{
						type: "input",
						name: "prod_id",
						message: "Which product do you want to update: ",
						validate: function(value) {
							if (isNaN(value) == false && value > 0 && value < results.length + 1) {
								return true;
							} else {
								return false;
							}
						}
					}, {
						type: "input",
						name: "update_quant",
						message: "Quantity to add: ",
						validate: function(value) {
							if (isNaN(value) == false && value > 0) {
								return true;
							} else {
								return false;
							}
						}
					}]).then(function(data) {
						var id = data.prod_id;
						var quant = data.update_quant;

						connection.query("UPDATE products SET stock_quantity = stock_quantity + " + quant + 
							" WHERE id = " + id, function (error, results) {
								if (error) {
									console.log("An error occured while updating products table");
								};
								restart();
							})
					})
				}
			})
		} else if (data.option == 4) {
			console.log("Departments: ");
			connection.query("SELECT * FROM departments", function (error, results) {
				if (error) {
					console.log("Error accessing departments table");
				} else {
					for (var i = 0; i < results.length; i++) {
						console.log("ID: " + results[i].id + " Department Name: " + results[i].department_name);
					};
				
					inquirer.prompt([{
						type: "input",
						name: "dept_id",
						message: "Which department would you like to update: ",
						validate: function(value) {
							if (isNaN(value) == false && value > 0) {
								return true;
							} else {
								return false;
							}
						}
					}, {
						type: "input",
						name: "prod_name",
						message: "Name of product: "
					}, {
						type: "input",
						name: "prod_price",
						message: "Price of product: ",
						validate: function(value) {
							if (isNaN(value) == false && value > 0) {
								return true;
							} else {
								return false;
							}
						}
					}, {
						type: "input",
						name: "prod_quant",
						message: "Quantity to add: ",
						validate: function(value) {
							if (isNaN(value) == false && value > 0) {
								return true;
							} else {
								return false;
							}
						}
					}]).then(function(data) {
						var dept = data.dept_id;
						var item = data.prod_name;
						var price = data.prod_price;
						var quant = data.prod_quant;

						connection.query("INSERT INTO products (product_name, department_id, price, stock_quantity)" + 
							" VALUE ('" + item + "', " + dept + ", " + price + ", " + quant + ")");
						console.log("\nITEM ADDED\n");
						connection.query("SELECT * FROM products", function (error, results) {
							for (var i = 0; i < results.length; i++) {
								console.log("ID: " + results[i].id + " Product: " + results[i].product_name + 
									" Department: " + results[i].department_id + " Price: " + results[i].price + 
									" Quantity: " + results[i].stock_quantity);
							};
							restart();
						});
					});
				};
			});
		};
	});
};

displayMenu();

function restart() {
	inquirer.prompt([{
		type: "confirm",
		name: "restart",
		message: "Return to menu? (Will exit otherwise)"
	}]).then(function(data) {
		if (!data.restart) {
			connection.end();
		} else {
			displayMenu();
		};
	});
};



// function restartOpOne() {

// }

// function restartOpTwo() {

// }

// function restartOpThree() {

// }

// function restartOpFour() {
	
// }