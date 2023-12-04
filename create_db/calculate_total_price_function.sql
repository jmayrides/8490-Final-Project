-- Function to compute total price using the listing_id
create or replace FUNCTION CalculateTotalPrice(
    p_listing_id IN INT,
    p_quantity IN INT
) RETURN DECIMAL
IS
    v_item_price DECIMAL(10,2);
    v_item_discount DECIMAL(3,2);
    p_price_total_quantity DECIMAL(10,2);
BEGIN
    -- Check if the listing_id is valid
    p_price_total_quantity := 0;
    IF p_quantity < 0 THEN
        DBMS_OUTPUT.PUT_LINE('Quantity value cannot be negative');
        RETURN 0;
    END IF;

    BEGIN
        SELECT price, discount
        INTO v_item_price, v_item_discount
        FROM Product
        WHERE listing_id = p_listing_id;

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            -- Invalid listing_id
            DBMS_OUTPUT.PUT_LINE('No data found for the listing id');
            RETURN 0;
        WHEN OTHERS THEN
            -- Other unexpected errors
            DBMS_OUTPUT.PUT_LINE('Invalid listing id. Please enter a valid one');
            RETURN 0;
    END;

    -- Calculate the total price based on quantity, price, and discount
    p_price_total_quantity := (v_item_price * p_quantity) * (1 - v_item_discount);

    -- If everything is successful, print a success message
    DBMS_OUTPUT.PUT_LINE('Total Price Calculation Successful!');
    RETURN p_price_total_quantity;
END CalculateTotalPrice;

-- testing the calculatetotalprice function
DECLARE
    p_price_total_quantity DECIMAL(10,2);
BEGIN
    p_price_total_quantity := CalculateTotalPrice(2, 3);
    IF p_price_total_quantity = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Could not calculate total price'); 
    ELSE
        DBMS_OUTPUT.PUT_LINE('Total Price: ' || p_price_total_quantity);
    END IF;
END;