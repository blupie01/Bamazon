// SELECT Orders.OrderID, Orders.OrderDate, Customers.CustomerName
// FROM Customers, Orders
// WHERE Customers.CustomerName="Around the Horn" AND Customers.CustomerID=Orders.CustomerID;

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Avernus#1',
  database : 'bamazon_db',
});

connection.connect();

connection.query("SELECT s.product_id, s.quantity_purchased, p.id, p.department_id, p.price" +  
	" FROM sales s LEFT JOIN products p ON s.product_id = p.id ORDER BY p.department_id", 
	function(error, results) {
	if (error) {
		console.log("Error getting table.");
	} else {
		console.log(results);



		// connection.query("SELECT * FROM departments LEFT JOIN " + results + " WHERE departments.id = " + results + ".department_id",
		// 	function(error, results2) {
		// 		if (error) {
		// 			console.log("Error merging table.");
		// 		} else {
		// 			console.log(results2);
		// 		}
		// 	})
	}
});


//Logic good -- I hope
// SELECT s.product_id, s.quantity_purchased, p.id, p.department_id, p.price FROM sales s 
// LEFT JOIN products p ON s.product_id = p.id ORDER BY p.department_id;



SELECT d.id, d.department_name, d.over_head_costs,
SUM(s.quantity_purchased * p.price) AS product_sales,
SUM(SUM(s.quantity_purchased * p.price) - d.over_head_costs) AS total_profit
FROM departments d
LEFT JOIN products p ON p.product_id = d.id 
LEFT JOIN sales s ON p.id = s.product_id;
GROUP BY department_name;


SELECT p.department_id, p.price, d.over_head_costs
FROM departments d
LEFT JOIN products p ON d.id = p.department_id
LEFT JOIN sales s ON p.id = s.product_id


SELECT 
    YEAR(orderDate) AS year,
    SUM(quantityOrdered * priceEach) AS product_sales
FROM
    orders
        INNER JOIN
    orderdetails USING (orderNumber)
WHERE
    status = 'Shipped'
GROUP BY YEAR(orderDate);

SELECT
	SUM(sales.quantity_purchased * products.price) AS product_sales,
	SUM(product_sales - departments.over_head_costs) AS total_profit
FROM
	departments
		LEFT JOIN
	products WHERE departments.id = products.department_id
		LEFT JOIN
	sales WHERE products.id = sales.product_id
GROUP BY department_id;



