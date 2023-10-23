DROP VIEW if exists public.kpi_values;
CREATE VIEW 
  public.kpi_values as
select
  kpi_value_history_id,
  kpi_id,
  circle_id,
  user_id,
  value,
  action,
  created_at,
  max_period_date
from
(select
  kpi_value_history_id,
  kpi_id,
  circle_id,
  user_id,
  value,
  action,
  created_at,
  max(period_date) over(partition by kpi_id, circle_id) max_period_date,
  rank() over(partition by kpi_id, circle_id order by period_date desc, created_at desc) rank
from kpi_values_history)
   as sq
where rank = 1;