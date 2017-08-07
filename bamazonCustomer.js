var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});


// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the initial function after the connection is made to prompt the user
  displayItems();
});

function completePurchase(product_id, new_quantity, sales_value, new_total_revenue){
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: new_quantity,
        total_revenue: new_total_revenue
      },
      {
        id: product_id
      }
    ],
    function(error) {
      if (error) throw error;
      console.log("Purchase completed for " + sales_value + ". Thank you for your business!");
    }
  );
};

function displayItems(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    results.forEach(function(element) {
        console.log(element.id + ")- " + element.product_name + " -- " + element.price);
    });
    inquirer
      .prompt([
        {
          type: "input", 
          message: "What would  you like to buy? (ID Number)",
          name: "productBuy"
        },
        {
          type: "input",
          message: "How many would you like to buy?",
          name: "quantity"
        } 
    ])
    .then(function(answer) {
      // The minus one accounts for indexes starting at 0 vs. product IDs starting at 1.
      var purchaseItem = answer.productBuy - 1;
      if (results[purchaseItem].stock_quantity < answer.quantity){
        console.log("Sorry, insufficient quantity for " + results[purchaseItem].product_name);
      } else {
        var updatedQuantity = results[purchaseItem].stock_quantity - answer.quantity;
        var totalSalesValue = answer.quantity * results[purchaseItem].price;
        var updatedTotalRevenue = results[purchaseItem].total_revenue + totalSalesValue;
        completePurchase(results[purchaseItem].id, updatedQuantity, totalSalesValue, updatedTotalRevenue);
      }
      connection.end(); 
    });
  });
};