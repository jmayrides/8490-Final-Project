DROP TABLE Customer CASCADE CONSTRAINTS;
DROP TABLE Seller CASCADE CONSTRAINTS;
DROP TABLE Product CASCADE CONSTRAINTS;
DROP TABLE Purchase CASCADE CONSTRAINTS;
DROP TABLE Payment CASCADE CONSTRAINTS;
DROP TABLE Cart CASCADE CONSTRAINTS;
DROP SEQUENCE Customer_Id_Generator;
DROP SEQUENCE Seller_Id_Generator;
DROP SEQUENCE Listing_Id_Generator;

CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    street VARCHAR2(255) NOT NULL,
    city VARCHAR2(255) NOT NULL,
    state VARCHAR2(2) NOT NULL CHECK (state IN ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY')),
    zip VARCHAR2(5) NOT NULL,
    email VARCHAR2(255) NOT NULL CHECK (email LIKE '%@%.%'),
    register_date DATE DEFAULT CURRENT_DATE NOT NULL,
    phone_number VARCHAR2(10) NOT NULL
);

CREATE TABLE Seller (
    seller_id INT PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    street VARCHAR2(255) NOT NULL,
    city VARCHAR2(255) NOT NULL,
    state VARCHAR2(2) NOT NULL CHECK (state IN ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY')),
    zip VARCHAR2(5) NOT NULL,
    email VARCHAR2(255) NOT NULL CHECK (email LIKE '%@%.%'),
    register_date DATE DEFAULT CURRENT_DATE NOT NULL,
    phone_number VARCHAR2(10) NOT NULL
);

CREATE TABLE Product (
    listing_id INT PRIMARY KEY,
    fresh VARCHAR2(5) CHECK (fresh IN ('true', 'false')),
    name VARCHAR2(255) NOT NULL,
    quantity_type VARCHAR2(255) NOT NULL CHECK (quantity_type IN ('Weight', 'Item')),
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    discount DECIMAL(3,2) NOT NULL CHECK (discount >= 0 AND discount < 1),
    item_category VARCHAR2(255) NOT NULL CHECK (item_category IN ('Fruit', 'Vegetable', 'Dairy', 'Meat', 'Other')),
    seller_id INT,
    FOREIGN KEY (seller_id) REFERENCES Seller(seller_id)
);

CREATE TABLE Purchase (
    purchase_id INT PRIMARY KEY,
    listing_id INT,
    quantity INT NOT NULL,
    delivery_type VARCHAR2(255) NOT NULL CHECK (delivery_type IN ('Delivery', 'Pick Up')),
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (listing_id) REFERENCES Product(listing_id)
);

CREATE TABLE Payment (
    payment_id INT PRIMARY KEY,
    customer_id INT,
    card_brand VARCHAR2(255) NOT NULL CHECK (card_brand IN ('Visa', 'Mastercard', 'Amex', 'Discover')),
    purchase_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (purchase_id) REFERENCES Purchase(purchase_id)
);

CREATE TABLE Cart (
    customer_id INT,
    listing_id INT,
    quantity INT NOT NULL CHECK (quantity >= 0),
    added_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY(customer_id, listing_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (listing_id) REFERENCES Product(listing_id)
);

CREATE SEQUENCE Customer_Id_Generator
  START WITH 1000
  INCREMENT BY 1
  NOMAXVALUE;
  
CREATE SEQUENCE Seller_Id_Generator
  START WITH 1000
  INCREMENT BY 1
  NOMAXVALUE;

CREATE SEQUENCE Listing_Id_Generator
  START WITH 1000
  INCREMENT BY 1
  NOMAXVALUE;
  
CREATE OR REPLACE TRIGGER Before_cart_insert
BEFORE INSERT ON Cart
FOR EACH ROW
DECLARE
    v_available_quantity NUMBER;
BEGIN
    -- Get the available quantity for the associated listing ID
    SELECT quantity INTO v_available_quantity
    FROM Product
    WHERE listing_id = :NEW.listing_id;

    -- Check the constraint
    IF :NEW.quantity > v_available_quantity THEN
        RAISE_APPLICATION_ERROR(-20001, 'Quantity in cart cannot be greater than available quantity.');
    END IF;
END;
