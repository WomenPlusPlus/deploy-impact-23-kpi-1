create
or replace function update_username_and_default_circle (
    p_user_id uuid,
    p_username text,
    p_default_circle_id int
) returns void as $ $ DECLARE v_default_circle_exists boolean;

BEGIN -- Update username in kpi_user table
UPDATE
    public.kpi_user
SET
    user_name = p_username
WHERE
    user_id = p_user_id;

-- Check if there is an existing row with default_circle set to true
SELECT
    EXISTS (
        SELECT
            1
        FROM
            public.circle_user
        WHERE
            default_circle = true
            AND user_id = p_user_id
    ) INTO v_default_circle_exists;

if v_default_circle_exists then -- Set default_circle to false for previous default circle
update
    public.circle_user
set
    default_circle = false
where
    circle_id = (
        select
            circle_id
        from
            public.circle_user
        where
            default_circle = true
            and user_id = p_user_id
    )
    and user_id = p_user_id;

end if;

update
    public.circle_user
set
    default_circle = true
where
    circle_id = p_default_circle_id
    and user_id = p_user_id;

end;

$ $ LANGUAGE plpgsql;