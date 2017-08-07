USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  price DECIMAL(6,2),
  stock_quantity INT,
  total_revenue DECIMAL(10,2),
  PRIMARY KEY (id)
);