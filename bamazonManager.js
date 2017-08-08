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

function viewProducts(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    results.forEach(function(element) {
        console.log(element.id + ")-- " + element.product_name + " (" + element.stock_quantity + ") -- " + element.price);
    });
    taskComplete();
  });
};

function viewLowInventory(){
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
    if (err) throw err;
    results.forEach(function(element) {
        console.log(element.id + ")-- " + element.product_name + " (" + element.stock_quantity + ") -- " + element.price);
    });
    taskComplete();
  });
};

function updateDatabaseInventory(updateId, newQuant){
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuant,
      },
      {
        id: updateId
      }
    ],
    function(error) {
      if (error) throw error;
      console.log("Quantity updated to " + newQuant + ".");
      taskComplete();
    }
  );
}

function addInventory(){
  var productsArray = [];
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    results.forEach(function(element) {
        productsArray.push(element.product_name + " (" + element.stock_quantity + ") -- " + element.id);
    });
    inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'itemAdd',
          message: "Which product would you like to add inventory for?",
          choices: productsArray
        },
        {
          type: 'input',
          name: 'quantAdd',
          message: "What is the updated quantity?"
        }
      ])
      .then(function(answer) {
        var addID =  answer.itemAdd.split('-- ')[1];
        var countUpdate = answer.quantAdd;
        updateDatabaseInventory(addID, countUpdate);
      });
    });
};

function addNewProduct(){
  var activeDepartments = [];
  connection.query("SELECT * FROM departments", function(err, results) {
    if (err) throw err;
    results.forEach(function(element) {
        activeDepartments.push(element.department_name);
    });
  });
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'productName',
      message: 'What is the name of the product you want to add?'
    }, 
    {
      type: 'rawlist',
      name: 'department',
      message: 'What department does this product belong in?',
      choices: activeDepartments
    },
    {
      type: 'input',
      name: 'price',
      message: 'How much does this product cost?'
    }, 
    {
      type: 'input',
      name: 'count',
      message: 'How many units are available?'
    }
  ])
  .then(function(answer) {
    // Basic validation 
    var localPrice = answer.price.replace('$', '');

    var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity, total_revenue) VALUES ('" + answer.productName + "', '" + answer.department + "', " + localPrice + ", " + answer.count + ", 0);";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      taskComplete();
    });
  });
};

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
              viewLowInventory()
              break;
          case 'Add to Inventory':
              addInventory()
              break;
          case 'Add New Product':
              addNewProduct()
              break;
          default:
              console.log("No menu item selected.");
      };
    });
};