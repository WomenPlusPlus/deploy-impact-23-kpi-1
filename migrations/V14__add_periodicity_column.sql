ALTER TABLE
    kpi_values_history
ADD
    COLUMN IF NOT EXISTS periodicity periodicity;

UPDATE
    kpi_values_history kvh
SET
    periodicity = k.periodicity
FROM
    kpi_definition k
WHERE
    kvh.kpi_id = k.kpi_id;

ALTER TABLE
    kpi_values_history
ALTER COLUMN
    periodicity
SET
    NOT NULL;