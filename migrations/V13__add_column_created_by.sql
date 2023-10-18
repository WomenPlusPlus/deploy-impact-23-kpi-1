ALTER TABLE
    kpi_definition
DROP
    CONSTRAINT IF EXISTS fk_auth_user;

ALTER TABLE
    kpi_definition
ADD
    COLUMN IF NOT EXISTS created_by uuid;


ALTER TABLE
    kpi_definition
ADD
    CONSTRAINT fk_auth_user FOREIGN KEY (created_by) REFERENCES auth.users (id);