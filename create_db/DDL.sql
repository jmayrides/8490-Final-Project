DROP TABLE Customer CASCADE CONSTRAINTS;
DROP TABLE Seller CASCADE CONSTRAINTS;
DROP TABLE Product CASCADE CONSTRAINTS;
DROP TABLE Purchase CASCADE CONSTRAINTS;
DROP TABLE Payment CASCADE CONSTRAINTS;
DROP TABLE Cart CASCADE CONSTRAINTS;

CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    street VARCHAR2(255) NOT NULL,
    city VARCHAR2(255) NOT NULL,
    state VARCHAR2(2) NOT NULL CHECK (state IN ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY')),
    zip VARCHAR2(5) NOT NULL,
    email VARCHAR2(255) NOT NULL CHECK (email LIKE '%@%.%'),
    register_date DATE DEFAULT CURRENT_DATE,
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
    register_date DATE DEFAULT CURRENT_DATE,
    phone_number VARCHAR2(10) NOT NULL
);

CREATE TABLE Product (
    listing_id INT PRIMARY KEY,
    fresh VARCHAR2(5) CHECK (fresh IN ('true', 'false')),
    name VARCHAR2(255),
    quantity_type VARCHAR2(255) CHECK (quantity_type IN ('Weight', 'Item')),
    quantity DECIMAL(10,2) CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    discount DECIMAL(3,2) CHECK (discount >= 0 AND discount < 1),
    item_category VARCHAR2(255) CHECK (item_category IN ('Fruit', 'Vegetable', 'Dairy', 'Meat', 'Other')),
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
