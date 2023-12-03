CREATE OR REPLACE PROCEDURE restock (p_listing_id IN NUMBER, p_quantity IN NUMBER) IS
BEGIN
    IF p_quantity > 0 THEN
        -- Update quantity
        UPDATE PRODUCT 
        SET QUANTITY = QUANTITY + p_quantity 
        WHERE LISTING_ID = p_listing_id;

        -- Set product to fresh
        UPDATE PRODUCT 
        SET FRESH = 'true' 
        WHERE LISTING_ID = p_listing_id;

        DBMS_OUTPUT.PUT_LINE('The product with listing ID ' || p_listing_id || ' has been restocked.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Please enter a valid restock quantity (greater than 0) and try again.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
END restock;


SET serveroutput on;
EXECUTE restock(1,20);
EXECUTE restock(1,-300);
EXECUTE restock(2,30);
EXECUTE restock(2,0);
EXECUTE restock(3,35);