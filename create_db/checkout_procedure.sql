-- Procedure for checkout
CREATE OR REPLACE PROCEDURE Checkout(p_customer_id IN INT, p_delivery_type IN VARCHAR)
IS 
    v_total_price DECIMAL := 0;
    v_cart_item_count INT;
BEGIN
    -- Loop through cart items for the given customer
    IF p_customer_id < 0 THEN
        DBMS_OUTPUT.PUT_LINE('Invalid value of p_customer_id');
        RETURN;
    END IF;
    
    IF UPPER(p_delivery_type) <> 'DELIVERY' AND UPPER(p_delivery_type) <> 'PICK UP' THEN
        DBMS_OUTPUT.PUT_LINE('Invalid delivery type entered.  Should be either delivery or pickup');
        RETURN;
    END IF;
    
    -- Check if there are items in the cart for the given customer
    SELECT COUNT(*)
    INTO v_cart_item_count
    FROM Cart
    WHERE customer_id = p_customer_id;

    IF v_cart_item_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('No items in the cart for the given customer.');
        RETURN;
    END IF;
    
    FOR cart_item IN (SELECT listing_id, quantity FROM Cart WHERE customer_id = p_customer_id)
    LOOP            
        BEGIN
            -- Compute the total price using the ComputeTotalPrice function
            v_total_price := v_total_price + CalculateTotalPrice(cart_item.listing_id, cart_item.quantity);

            -- Insert into Purchase table
            INSERT INTO Purchase (purchase_id, listing_id, quantity, delivery_type, customer_id)
            VALUES (Purchase_Id_Generator.NEXTVAL, cart_item.listing_id, cart_item.quantity, p_delivery_type, p_customer_id);

            -- Update quantities for respective listings
            UPDATE Product
            SET quantity = quantity - cart_item.quantity
            WHERE listing_id = cart_item.listing_id;

        EXCEPTION
            WHEN OTHERS THEN
                -- Handle errors if necessary
                DBMS_OUTPUT.PUT_LINE('Error processing checkout');
        END;
    END LOOP;
    -- Display total price
    DBMS_OUTPUT.PUT_LINE('Total Price for all the items: ' || v_total_price);
    
    -- Clear the cart for the customer
    DELETE FROM Cart WHERE customer_id = p_customer_id;

    DBMS_OUTPUT.PUT_LINE('Checkout completed successfully.');
END Checkout;

-- test procedure
SET SERVEROUTPUT ON
DECLARE
  v_customer_id INT := 4;
  v_delivery_type VARCHAR(255) := 'delivery';  -- or 'Pick Up'
BEGIN
  Checkout(v_customer_id, v_delivery_type);
END;