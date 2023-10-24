CREATE OR REPLACE VIEW 
  public.kpi_definition_with_latest_values as
select
  ckd.circle_kpidef_id,
  ckd.circle_id,
  kd.kpi_id,
  kd.kpi_name,
  kd.description,
  kd.periodicity,
  kd.value_min,
  kd.value_max,
  kd.unit,
  kd.created_at as kpi_created_at,
  kd.updated_at as kpi_updated_at,
  kd.active,
  kd.is_approved,
  t1.latest_value,
  t1.latest_user_id,
  t1.latest_standardized_date,
  c.circle_name,
  t.target_id,
  t.target_value,
  previous_value,
  case when t1.latest_value > 0 and previous_value > 0 then ((t1.latest_value-previous_value)/previous_value)*100 else null end as percentage_change
from
  circle_kpi_definition ckd
  join kpi_definition kd
  on ckd.kpi_id = kd.kpi_id
  left join (
    select *
    from
    (
    select
      kpi_id,
      circle_id,
      standardized_date as latest_standardized_date,
      value as latest_value,
      user_id as latest_user_id,
      rank() over(partition by kpi_id, circle_id order by standardized_date desc, created_at desc) as rank
    from
      kpi_values_period_standardized) sq
      where rank = 1) t1
  on ckd.kpi_id = t1.kpi_id
  join circle c
  on t1.circle_id = c.circle_id
  and ckd.circle_id = t1.circle_id
  left join target t
  on kd.kpi_id = t.kpi_id
  and ckd.circle_id = t.circle_id
  LEFT JOIN (
    SELECT kpi_id, circle_id, value as previous_value from(
      SELECT kpi_id, circle_id, rank () over (
      partition by kpi_id, circle_id
      order by standardized_date desc) as rank, standardized_date, value
      FROM kpi_values_period_standardized
    ) as ranked
      WHERE rank = 2
  ) as previous_period
  ON t1.kpi_id = previous_period.kpi_id and t1.circle_id = previous_period.circle_id
order by
kpi_id,
  ckd.circle_kpidef_id;