WITH RECURSIVE date_series AS (
  -- Start with the first day of the previous month
  SELECT date_trunc('month', current_date - interval '1 month')::date AS period_date
  UNION
  -- Recursively subtract one month until reaching 12 months in the past
  SELECT (period_date - interval '1 month')::date
  FROM date_series
  WHERE period_date > date_trunc('month', current_date - interval '12 months')
)

-- Insert the synthetic data
INSERT INTO public.kpi_values_history (
  kpi_id,
  circle_id,
  user_id,
  value,
  period_date,
  action,
  created_at
)
SELECT
  ckd.kpi_id,
  ckd.circle_id,
  cu.user_id,
  -- Generate a random value between 0 and 1000 for synthetic data
  round(random() * 1000) AS value,
  ds.period_date,
  'CREATE' AS action,
  current_timestamp AS created_at
FROM
  date_series ds
-- Cross join to get all combinations of dates and KPI definitions
CROSS JOIN
  public.circle_kpi_definition ckd
-- Join with kpi_definition to filter only 'monthly' KPIs
JOIN
  public.kpi_definition kd ON ckd.kpi_id = kd.kpi_id
-- Join with circle_user to associate the correct user for each circle
JOIN
  public.circle_user cu ON ckd.circle_id = cu.circle_id
WHERE
  kd.periodicity = 'monthly';
