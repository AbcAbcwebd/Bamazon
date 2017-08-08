var mysql = require("mysql");
var inquirer = require("inquirer");
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

// Function to run when a task is complete.
function taskComplete(){
  inquirer
  .prompt([
    {
      type: 'confirm',
      name: 'exit',
      message: 'Do you want to exit the program?'
    }
  ])
  .then(function(answer) {
    if (answer.exit){
      connection.end();
    } else {
      start();
    };
  });
};

function viewSales(){
  console.log("Running function")
  connection.query("SELECT departments.id, departments.department_name, departments.over_head_costs, SUM(products.total_revenue) AS product_sales, (SUM(products.total_revenue) - departments.over_head_costs) AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.id;", function(err, results) {
    console.log("MySQL call made")
//    console.log(results)
    if (err) throw err;
    console.table(results);
    console.log("table displayed")
    taskComplete();
  });
};

function addDepartment(){
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'newDepartment',
      message: 'What is the name of the department you want to add?'
    }, 
    {
      type: 'input',
      name: 'fixedCost',
      message: 'What is the overhead cost for this department?'
    }
  ])
  .then(function(answer) {
    // Basic validation 
    var localCost = answer.fixedCost.replace('$', '');

    var sql = "INSERT INTO departments (department_name, over_head_costs) VALUES ('" + answer.newDepartment + "', '" + localCost + "');";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      taskComplete();
    });
  });
};

function viewHighestGross(){
  connection.query("SELECT product_name, total_revenue FROM products ORDER BY total_revenue DESC;", function(err, results) {
    if (err) throw err;
    console.table(results);
    taskComplete();
  });
};

function start(){
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View Product Sales by Department', 'Create New Department', 'Highest Grossing Products']
      }
    ])
    .then(function(answer) {
      switch(answer.menu) {
          case 'View Product Sales by Department':
              viewSales();
              break;
          case 'Create New Department':
              addDepartment();
              break;
          case 'Highest Grossing Products':
              viewHighestGross();
              break;
          default:
              console.log("No menu item selected.");
      };
    });
};