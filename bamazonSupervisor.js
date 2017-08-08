var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');
var console = require('better-console');

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

function viewSales(){
  console.log("Function running")
  connection.query("SELECT departments.id, departments.department_name, departments.over_head_costs, SUM(products.total_revenue) AS product_sales, (SUM(products.total_revenue) - departments.over_head_costs) AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.id;", function(err, results) {
    if (err) throw err;
//    console.log(results)
    console.table(results);
  });
};

function start(){
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View Product Sales by Department', 'Create New Department']
      }
    ])
    .then(function(answer) {
      switch(answer.menu) {
          case 'View Product Sales by Department':
              viewSales();
              break;
          case 'Create New Department':
//              viewLowInventory()
              break;
          default:
              console.log("No menu item selected.");
      };
    });
};