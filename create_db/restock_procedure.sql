CREATE OR REPLACE PROCEDURE restock (sell in NUMBER, plist in NUMBER, quant in NUMBER) IS
BEGIN
    -- update quantity
    UPDATE PRODUCT SET QUANTITY = (QUANTITY + quant) WHERE SELLER_ID = sell AND LISTING_ID = plist;
    -- set product to fresh
    UPDATE PRODUCT SET FRESH = 'true' WHERE SELLER_ID = sell AND LISTING_ID = plist;
    DBMS_OUTPUT.PUT_LINE('The product has been restocked.');
END restock;

SET serveroutput on;
EXECUTE restock(1,1,20);
EXECUTE restock(1,2,30);
EXECUTE restock(3,3,35);