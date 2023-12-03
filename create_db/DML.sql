-- Veggie Vibes DML

-- inserts for CUSTOMER table
INSERT INTO Customer VALUES (1,'Dexter Norris','Ap #984-9027 Eget, Rd.','Gillette','IN','45554','nam.ac@google.edu',CURRENT_DATE,'3272772734');
INSERT INTO Customer VALUES (2,'Dean Castillo','Ap #568-3733 In, St.','Stamford','WA','63234','iaculis.enim.sit@outlook.com',CURRENT_DATE,'6213395588');
INSERT INTO Customer VALUES (3,'Kalia French','Ap #844-840 Aliquam Av.','Indianapolis','VT','87155','iaculis@icloud.com',CURRENT_DATE,'3646328221');
-- CUSTOMER update
UPDATE Customer SET PHONE_NUMBER = '2144898528' WHERE CUSTOMER_ID = 2;

-- inserts for SELLER table
INSERT INTO Seller VALUES (1,'Rhea Morales','142 Dis Road','Reno','NV','62516','mauris@icloud.org',CURRENT_DATE,'6772353682');
INSERT INTO Seller VALUES (2,'Rhea Thornton','141-9619 Suspendisse Ave','Bellevue','WA','84858','mi.enim@icloud.org',CURRENT_DATE,'4712268831');
INSERT INTO Seller VALUES (3,'Asher Shepherd','Ap #915-8982 Amet, Street','Fresno','CA','96807','magna.praesent@protonmail.com',CURRENT_DATE,'7356536525');
-- SELLER update
UPDATE Seller SET EMAIL = 'shepherd.farms@gmail.com' WHERE SELLER_ID = 3;

-- inserts for PRODUCT table
INSERT INTO Product VALUES (1,'false','Cucumber','Item','98',19,0,'Vegetable',1);
INSERT INTO Product VALUES (2,'true','Tomato','Weight','91',12,0,'Fruit',1);
INSERT INTO Product VALUES (3,'false','Cucumber','Item','106',3,0.1,'Vegetable',3);
-- PRODUCT UPDATE
UPDATE Product SET FRESH = 'false' where LISTING_ID = 2;

-- inserts for PURCHASE table
INSERT INTO Purchase VALUES (1,1,8,'Delivery',1);
INSERT INTO Purchase VALUES (2,2,3,'Pick Up',2);
INSERT INTO Purchase VALUES (3,3,10,'Pick Up',3);

-- inserts for PAYMENT table
INSERT INTO Payment VALUES (1,1,'Visa',1);
INSERT INTO Payment VALUES (2,2,'Discover',2);
INSERT INTO Payment VALUES (3,3,'Visa',3);

-- inserts for CART table
INSERT INTO Cart VALUES (3,3,10,CURRENT_DATE);
INSERT INTO Cart VALUES (2,2,3,CURRENT_DATE);
INSERT INTO Cart VALUES (1,1,8,CURRENT_DATE);
-- CART update
UPDATE Cart SET QUANTITY = '5' WHERE CUSTOMER_ID = 3 AND LISTING_ID = 3;