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
  start();
});

function viewProducts(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    results.forEach(function(element) {
        console.log(element.id + ")-- " + element.product_name + " (" + element.stock_quantity + ") -- " + element.price);
    });
  });
}

function start(){
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
      }
    ])
    .then(function(answer) {
      switch(answer.menu) {
          case 'View Products for Sale':
              viewProducts();
              break;
          case 'View Low Inventory':
//              code block
              break;
          case 'Add to Inventory':
//              code block
              break;
          case 'Add New Product':
//              code block
              break;
          default:
              console.log("No menu item selected.");
      };
      connection.end(); 
    });
};