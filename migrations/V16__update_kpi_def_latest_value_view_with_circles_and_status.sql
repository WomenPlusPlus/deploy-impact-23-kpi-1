CREATE OR REPLACE VIEW public.kpi_definition_with_latest_values AS
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
  kd.is_approved,
  kd.active,
  t1.latest_value,
  t1.latest_user_id,
  t1.latest_standardized_date,
  c.circle_name,
  t.target_id,
  t.target_value
from
  circle_kpi_definition ckd
  join kpi_definition kd on ckd.kpi_id = kd.kpi_id
  left join (
    select
      kv.kpi_id,
      kv.circle_id,
      kv.standardized_date as latest_standardized_date,
      kv.value as latest_value,
      kv.user_id as latest_user_id
    from
      kpi_values_period_standardized kv
      join (
        select
          kpi_values_period_standardized.kpi_id,
          kpi_values_period_standardized.circle_id,
          max(kpi_values_period_standardized.standardized_date) as max_standardized_date
        from
          kpi_values_period_standardized
        group by
          kpi_values_period_standardized.kpi_id,
          kpi_values_period_standardized.circle_id
      ) max_dates on kv.kpi_id = max_dates.kpi_id
      and kv.circle_id = max_dates.circle_id
      and kv.standardized_date = max_dates.max_standardized_date
  ) t1 on ckd.kpi_id = t1.kpi_id
  join circle c on t1.circle_id = c.circle_id
  and ckd.circle_id = t1.circle_id
  left join target t on kd.kpi_id = t.kpi_id and ckd.circle_id =t.circle_id
  order by 1