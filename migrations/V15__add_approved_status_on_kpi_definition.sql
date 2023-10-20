ALTER TABLE kpi_definition
ADD COLUMN is_approved boolean NOT NULL DEFAULT FALSE;

UPDATE kpi_definition
SET is_approved = true;