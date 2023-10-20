ALTER TABLE
    kpi_definition
ADD
    COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT FALSE;

UPDATE
    is_approved 
SET
    is_approved = true;
