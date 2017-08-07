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
};

function viewLowInventory(){
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
    if (err) throw err;
    results.forEach(function(element) {
        console.log(element.id + ")-- " + element.product_name + " (" + element.stock_quantity + ") -- " + element.price);
    });
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
//              code block
              break;
          default:
              console.log("No menu item selected.");
      };
    });
};