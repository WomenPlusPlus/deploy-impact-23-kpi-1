DROP VIEW if exists public.kpi_logs;
CREATE VIEW
  public.kpi_logs as
select
  kvh.kpi_value_history_id,
  kvh.kpi_id,
  kvh.circle_id,
  kvh.user_id,
  kvh.value,
  kvh.period_date,
  kvh.action,
  kvh.created_at,
  kvh.comment,
  ku.user_name,
  uwdc.circle_id as user_circle_id,
  c.circle_name as user_circle_name,
  case
    when kvh.periodicity = 'yearly'::periodicity then date_trunc(
      'year'::text,
      kvh.period_date::timestamp with time zone
    ) + '1 year'::interval - '1 day'::interval
    when kvh.periodicity = 'monthly'::periodicity then date_trunc(
      'month'::text,
      kvh.period_date::timestamp with time zone
    ) + '1 mon'::interval - '1 day'::interval
    when kvh.periodicity = 'quarterly'::periodicity then date_trunc(
      'quarter'::text,
      kvh.period_date::timestamp with time zone
    ) + '3 mons'::interval - '1 day'::interval
    when kvh.periodicity = 'weekly'::periodicity then date_trunc(
      'week'::text,
      kvh.period_date::timestamp with time zone
    ) - '1 day'::interval + '7 days'::interval
    else kvh.period_date::timestamp with time zone
  end as historical_standardized_date,
  kvh.periodicity
from
  kpi_values_history kvh
  left join kpi_user ku on kvh.user_id = ku.user_id
  left join username_with_default_circle uwdc on kvh.user_id = uwdc.user_id
  left join circle c on uwdc.circle_id = c.circle_id
order by
  kvh.created_at desc;
          