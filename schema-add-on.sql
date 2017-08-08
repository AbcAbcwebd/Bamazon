USE bamazon;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100),
  over_head_costs DECIMAL(8,2),
  PRIMARY KEY (id)
);