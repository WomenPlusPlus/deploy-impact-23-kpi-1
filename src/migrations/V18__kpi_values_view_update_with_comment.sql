CREATE OR REPLACE VIEW 
  public.kpi_values_period_standardized as
select distinct
  on (
    kd.kpi_id,
    standardized_date,
    t1.circle_id
  ) t1.kpi_value_history_id,
  t1.kpi_id,
  t1.circle_id,
  t1.user_id,
  t1.value,
  t1.period_date,
  t1.action,
  t1.created_at,
  kd.periodicity as kpi_periodicity,
  case
    when kd.periodicity = 'yearly'::periodicity then date_trunc(
      'year'::text,
      t1.period_date::timestamp with time zone
    ) + '1 year'::interval - '1 day'::interval
    when kd.periodicity = 'monthly'::periodicity then date_trunc(
      'month'::text,
      t1.period_date::timestamp with time zone
    ) + '1 mon'::interval - '1 day'::interval
    when kd.periodicity = 'quarterly'::periodicity then date_trunc(
      'quarter'::text,
      t1.period_date::timestamp with time zone
    ) + '3 mons'::interval - '1 day'::interval
    when kd.periodicity = 'weekly'::periodicity then date_trunc(
      'week'::text,
      t1.period_date::timestamp with time zone
    ) - '1 day'::interval + '7 days'::interval
    else t1.period_date::timestamp with time zone
  end as standardized_date,
  ku.user_name,
    t1.comment
from
  kpi_values_history t1
  join kpi_definition kd on t1.kpi_id = kd.kpi_id
  left join kpi_user ku on t1.user_id = ku.user_id
order by
  kd.kpi_id,
  standardized_date desc,
  t1.circle_id,
  t1.created_at desc;