ALTER TABLE
    kpi_definition
ADD
    COLUMN IF NOT EXISTS created_by uuid;

ALTER TABLE
    kpi_definition
ADD
    CONSTRAINT IF NOT EXISTS fk_auth_user FOREIGN KEY (created_by) REFERENCES auth.users (id);