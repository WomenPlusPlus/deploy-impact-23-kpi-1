-- check that value_min is not negative (NULLS are allowed if no range is needed)

ALTER TABLE public.kpi_definition
ADD CONSTRAINT chk_value_min_nonnegative 
    CHECK (value_min >= 0);

-- check for non-empty strings 

ALTER TABLE public.kpi_definition
ADD CONSTRAINT chk_non_empty_kpi_name
    CHECK (LENGTH(TRIM(kpi_name)) > 0);


-- check that value_max is either greater than value_min or Is NULL

ALTER TABLE public.kpi_definition
ADD CONSTRAINT chk_value_max_greater_than_min 
    CHECK ((value_max > value_min) OR (value_max IS NULL));

-- check for non-empty strings

ALTER TABLE public.kpi_user
ADD CONSTRAINT chk_non_empty_username 
    CHECK (LENGTH(TRIM(user_name)) > 0);

-- check for valid date 

ALTER TABLE public.kpi_values_history
ADD CONSTRAINT chk_valid_period_date CHECK (period_date <= CURRENT_DATE);
