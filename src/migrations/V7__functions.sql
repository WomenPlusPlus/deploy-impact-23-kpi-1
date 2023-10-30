CREATE OR REPLACE FUNCTION check_kpi_value_unit()
RETURNS TRIGGER AS $$
DECLARE
    unit_type unit; 
BEGIN
    -- check that value is not NULL
    IF NEW.value IS NULL THEN
        RAISE EXCEPTION 'Value cannot be NULL';
    END IF;
    -- get the unit type associated with the kpi_id
    SELECT unit INTO unit_type FROM kpi_definition WHERE kpi_id = NEW.kpi_id;
    -- Check if unit type is valid
    IF unit_type IS NULL THEN
        RAISE EXCEPTION 'Invalid kpi_id: no unit set';
    -- unit = '%', value should be zero or positive
    ELSIF unit_type = '%' AND NEW.value < 0 THEN --check
        RAISE EXCEPTION 'Value for percentage unit must be zero or a positive number';
    -- unit = 'boolean', value should be 0 or 1 (integer)
    ELSIF unit_type = 'boolean' AND (NEW.value < 0 OR NEW.value > 1 OR NEW.value <> CAST(NEW.value AS INTEGER)) THEN
        RAISE EXCEPTION 'Value for boolean unit must be 0 or 1';
    -- unit = 'numeric', value should be zero or positive
    ELSIF unit_type = 'numeric' AND NEW.value < 0 THEN
        RAISE EXCEPTION 'Value for numeric unit must be zero or a positive number';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_default_circle_count()
RETURNS TRIGGER AS $$
DECLARE sum_circles INTEGER;
BEGIN
    IF NEW.default_circle = TRUE THEN
    SELECT SUM(CASE WHEN default_circle = TRUE THEN 1 ELSE 0 END) INTO sum_circles
    FROM circle_user
    WHERE user_id = NEW.user_id
    GROUP BY user_id;
        IF sum_circles >= 1 THEN
            RAISE EXCEPTION 'User can''t have more than one default circle';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;